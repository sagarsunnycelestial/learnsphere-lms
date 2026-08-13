import { GraphQLError } from 'graphql/error/GraphQLError.js';
import {
  CourseUpdateArgs,
  Context,
  UserRoles,
  AuthPayload,
  EnrollCourseArgs,
} from '../../types/types.js';
import { ERROR_MESSAGES } from '../constants/messages.js';
import { userRepo, courseRepo, enrollmentRepo } from '../entities/repos.js';

async function createACourse(args: CourseUpdateArgs, context: Context) {
  const { courseName, description, thumbnail_image_path } = args.input;
  if (context.user?.user_id) {
    const creatingUser = await userRepo.findOne({
      where: {
        userId: context.user?.user_id,
      },
      relations: {
        courses: true,
      },
    });

    if (!creatingUser) throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND);

    try {
      const newCourse = courseRepo.create({
        courseName: courseName,
        description: description,
        createdBy: creatingUser,
        thumbnail_image_path: thumbnail_image_path,
      });
      if (!newCourse) throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_CREATE_COURSE);
      await courseRepo.save(newCourse);
      return { message: 'Course created successfully' };
    } catch {
      throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_CREATE_COURSE);
    }
  }
}
async function fetchAllCourses(filter: { status?: string }, userId: string, userRole: string) {
  try {
    const courses = await courseRepo.find({
      order: {
        isActive: 'DESC',
        courseName: 'ASC',
      },
      relations: {
        createdBy: true,
        lessons: true,
        enrollments: {
          user: true,
        },
        quizzes: true,
      },
    });

    if (!courses) {
      throw new GraphQLError(ERROR_MESSAGES.COURSES_NOT_FOUND);
    }

    const filteredCourses = courses
      .filter((course) => {
        if (filter?.status === 'active') {
          return course.isActive === true;
        }

        if (filter?.status === 'inactive') {
          return course.isActive === false;
        }

        return true;
      })
      .map((course) => {
        const isEnrolled = course.enrollments.some(
          (enrollment) => enrollment.user.userId === userId
        );

        const canModify = course.createdBy.userId === userId || userRole === UserRoles.ADMIN;

        return {
          ...course,
          isEnrolled,
          canModify,
        };
      });

    return filteredCourses;
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_FETCH_COURSES);
  }
}

async function editCourseDetails(args: CourseUpdateArgs) {
  const { courseName, courseId, description, thumbnail_image_path, isActive } = args.input;
  try {
    if (!courseId) throw new GraphQLError(ERROR_MESSAGES.COURSES_ID_INVALID);

    const updatedCourse = await courseRepo.findOne({
      where: {
        courseId: courseId,
      },
    });
    if (!updatedCourse) throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_EDIT_COURSE);
    if (description) {
      updatedCourse.description = description;
    }
    if (courseName) {
      updatedCourse.courseName = courseName;
    }

    if (thumbnail_image_path) {
      updatedCourse.thumbnail_image_path = thumbnail_image_path;
    }
    if (isActive === false) {
      updatedCourse.isActive = false;
    } else updatedCourse.isActive = true;

    await courseRepo.save(updatedCourse);
    return { message: 'Course edited successfully' };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }
    throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_FETCH_COURSES);
  }
}

async function deleteCourseFromDB(courseId: string) {
  try {
    const deletedCourse = await courseRepo.findOne({
      where: {
        courseId: courseId,
      },
    });
    if (!deletedCourse) throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_DELETE_COURSE);
    await courseRepo.remove(deletedCourse);
    return { message: 'Course deleted successfully' };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }
    throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_FETCH_COURSES);
  }
}
async function fetchASingleCourse(courseId: string, user: AuthPayload) {
  try {
    const course = await courseRepo.findOne({
      where: {
        courseId: courseId,
      },
      relations: {
        createdBy: true,
        lessons: true,
        enrollments: {
          user: true,
        },
        quizzes: {
          questions: {
            options: true,
          },
        },
      },
    });
    if (!course) throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_FETCH_COURSES);

    const isEnrolled = course.enrollments.some(
      (enrollment) => enrollment.user.userId === user.user_id && enrollment.isActive === true
    );
    const canModify = course.createdBy.userId === user.user_id || user.role === UserRoles.ADMIN;
    if (!isEnrolled && !canModify) {
      const filteredcourse = {
        ...course,
        totalLessons: course.lessons.length,
        lessons: [],
        quizzes: [],
        totalEnrolled: course.enrollments.length,
        enrollments: [],
      };
      return filteredcourse;
    }
    if (canModify) {
      const filteredcourse = {
        ...course,
        totalLessons: course.lessons.length,
        totalEnrolled: course.enrollments.length,
        canModify: true,
      };
      return filteredcourse;
    }
    return {
      ...course,
      totalLessons: course.lessons.length,
      totalEnrolled: course.enrollments.length,
      canModify: false,
      isEnrolled: true,
    };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }
    throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_FETCH_COURSES);
  }
}
async function enrollAStudent(args: EnrollCourseArgs, context: Context) {
  const userId = args.input.userId ?? context.user?.user_id;
  const courseId = args.input.courseId;

  try {
    if (!userId || !courseId) {
      throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_ENROLL_USER);
    }

    const course = await courseRepo.findOne({
      where: {
        courseId,
      },
    });

    const enrollingUser = await userRepo.findOne({
      where: {
        userId,
      },
    });

    if (!course || !enrollingUser) {
      throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_ENROLL_USER);
    }

    const existingEnrollment = await enrollmentRepo.findOne({
      where: {
        user: {
          userId,
        },
        course: {
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      if (existingEnrollment.isActive) {
        throw new GraphQLError('User is already enrolled in this course');
      }

      existingEnrollment.isActive = true;
      await enrollmentRepo.save(existingEnrollment);

      return {
        message: `${enrollingUser.username} enrolled successfully`,
      };
    }

    const newEnrollment = enrollmentRepo.create({
      user: enrollingUser,
      course,
      isActive: true,
    });

    await enrollmentRepo.save(newEnrollment);

    return {
      message: `${enrollingUser.username} enrolled successfully`,
    };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_ENROLL_USER);
  }
}

async function unEnrollFromCourse(args: EnrollCourseArgs, context: Context) {
  const userId = args.input.userId ?? context.user?.user_id;
  const courseId = args.input.courseId;

  try {
    if (!userId || !courseId) {
      throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_UNENROLL_USER);
    }

    const existingEnrollment = await enrollmentRepo.findOne({
      where: {
        user: {
          userId,
        },
        course: {
          courseId,
        },
        isActive: true,
      },
      relations: {
        user: true,
      },
    });

    if (!existingEnrollment) {
      throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_UNENROLL_USER);
    }

    existingEnrollment.isActive = false;

    await enrollmentRepo.save(existingEnrollment);

    return {
      message: `${existingEnrollment.user.username} unenrolled successfully`,
    };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_UNENROLL_USER);
  }
}

export {
  createACourse,
  fetchAllCourses,
  editCourseDetails,
  deleteCourseFromDB,
  fetchASingleCourse,
  enrollAStudent,
  unEnrollFromCourse,
};
