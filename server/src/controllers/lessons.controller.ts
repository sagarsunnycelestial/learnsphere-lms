import { DeleteLessonArgs, LessonUpdateArgs, UserRoles } from '../../types/types.js';
import { AppDataSource } from '../config/dbConfig.js';
import { Courses } from '../entities/Courses.js';
import { Lessons } from '../entities/Lessons.js';
import { GraphQLError } from 'graphql';
import { ERROR_MESSAGES } from '../constants/messages.js';
import { Context } from '../../types/types.js';

async function addLessonToCourse(args: LessonUpdateArgs, context: Context) {
  const courseRepo = AppDataSource.getRepository(Courses);
  const lessonRepo = AppDataSource.getRepository(Lessons);

  const { lessonName, description, videoLink, courseId, sortOrder } = args.input;
  if (!courseId || !lessonName) throw new GraphQLError(ERROR_MESSAGES.LESSON_NOT_CREATED);

  let course;

  try {
    if (context.user?.role === UserRoles.ADMIN) {
      course = await courseRepo.findOne({
        where: {
          courseId: courseId,
        },
        relations: {
          lessons: true,
        },
      });
    } else if (context.user?.user_id) {
      course = await courseRepo.findOne({
        where: {
          courseId: courseId,
          createdBy: {
            userId: context.user?.user_id,
          },
        },
        relations: {
          lessons: true,
        },
      });
    }

    if (!course) throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_FETCH_COURSES);
    const newLesson = lessonRepo.create({
      lessonName,
      description: description ?? '',
      videoLink: videoLink ?? '',
      sortOrder: course.lessons.length + 1,
      course: course,
    });
    await lessonRepo.save(newLesson);
    return { message: `Lesson for ${course.courseName}. created successfully` };
  } catch (err) {
    console.error('ADD LESSON ERROR:', err);
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw new GraphQLError(ERROR_MESSAGES.LESSON_NOT_CREATED);
  }
}

async function editLessonInCourse(args: LessonUpdateArgs, context: Context) {
  const lessonRepo = AppDataSource.getRepository(Lessons);

  const { lessonName, lessonId, description, videoLink, courseId, sortOrder } = args.input;
  if (!courseId || !lessonId) throw new GraphQLError(ERROR_MESSAGES.LESSON_NOT_FOUND);
  try {
    if (!context.user) {
      throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);
    }
    const updatingLesson = await lessonRepo.findOne({
      where: {
        lessonId,
        course: {
          courseId,
          ...(context.user.role !== UserRoles.ADMIN
            ? { createdBy: { userId: context.user.user_id } }
            : {}),
        },
      },
      relations: { course: true },
    });
    if (!updatingLesson) throw new GraphQLError(ERROR_MESSAGES.LESSON_NOT_FOUND);

    updatingLesson.lessonName = lessonName;
    if (description) {
      updatingLesson.description = description;
    }
    if (sortOrder !== undefined) {
      updatingLesson.sortOrder = sortOrder;
    }
    if (videoLink) {
      updatingLesson.videoLink = videoLink;
    }
    await lessonRepo.save(updatingLesson);
    return {
      message: `Lesson ${updatingLesson.lessonName}. updated successfully`,
    };
  } catch (err) {
    console.error('ADD LESSON ERROR:', err);
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw new GraphQLError(ERROR_MESSAGES.LESSON_NOT_CREATED);
  }
}
async function deleteLessonInCourse(args: DeleteLessonArgs, context: Context) {
  const lessonRepo = AppDataSource.getRepository(Lessons);

  const { lessonId, courseId } = args.input;
  if (!courseId || !lessonId) throw new GraphQLError(ERROR_MESSAGES.LESSON_NOT_FOUND);
  try {
    if (!context.user) {
      throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);
    }
    const deletingLesson = await lessonRepo.findOne({
      where: {
        lessonId,
        course: {
          courseId,
          ...(context.user.role !== UserRoles.ADMIN
            ? { createdBy: { userId: context.user.user_id } }
            : {}),
        },
      },
      relations: { course: true },
    });
    if (!deletingLesson) throw new GraphQLError(ERROR_MESSAGES.LESSON_NOT_FOUND);
    await lessonRepo.remove(deletingLesson);

    return {
      message: `Lesson ${deletingLesson.lessonName}. deleted successfully`,
    };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw new GraphQLError(ERROR_MESSAGES.LESSON_NOT_CREATED);
  }
}

export { addLessonToCourse, editLessonInCourse, deleteLessonInCourse };
