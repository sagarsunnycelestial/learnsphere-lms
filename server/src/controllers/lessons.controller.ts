import {
  DeleteLessonArgs,
  LessonUpdateArgs,
  UserRoles,
} from '../../types/types.js';
import { GraphQLError } from 'graphql';
import { ERROR_MESSAGES } from '../constants/messages.js';
import { Context } from '../../types/types.js';
import { lessonRepo, courseRepo } from '../entities/repos.js';
import { withErrorHandling } from '../utils/withErrorHandling.js';
async function addLessonToCourseRaw(args: LessonUpdateArgs, context: Context) {
  const { lessonName, description, videoLink, courseId } = args.input;
  if (!courseId || !lessonName)
    throw new GraphQLError(ERROR_MESSAGES.LESSON_NOT_CREATED);

  let course;

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
}

async function editLessonInCourseRaw(args: LessonUpdateArgs, context: Context) {
  const { lessonName, lessonId, description, videoLink, courseId } = args.input;
  if (!courseId || !lessonId)
    throw new GraphQLError(ERROR_MESSAGES.LESSON_NOT_FOUND);
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
  if (videoLink) {
    updatingLesson.videoLink = videoLink;
  }
  await lessonRepo.save(updatingLesson);
  return {
    message: `Lesson ${updatingLesson.lessonName}. updated successfully`,
  };
}
async function deleteLessonInCourseRaw(
  args: DeleteLessonArgs,
  context: Context
) {
  const { lessonId, courseId } = args.input;
  if (!courseId || !lessonId)
    throw new GraphQLError(ERROR_MESSAGES.LESSON_NOT_FOUND);
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
}

export const addLessonToCourse = withErrorHandling(
  addLessonToCourseRaw,
  ERROR_MESSAGES.LESSON_NOT_CREATED
);
export const editLessonInCourse = withErrorHandling(
  editLessonInCourseRaw,
  ERROR_MESSAGES.FAILED_TO_EDIT_LESSON
);

export const deleteLessonInCourse = withErrorHandling(
  deleteLessonInCourseRaw,
  ERROR_MESSAGES.FAILED_TO_DELETE_LESSON
);
