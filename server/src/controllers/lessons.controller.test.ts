/* eslint-disable */

import {
  addLessonToCourse,
  editLessonInCourse,
  deleteLessonInCourse,
} from './lessons.controller.js';
import { lessonRepo, courseRepo } from '../entities/repos.js';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { ERROR_MESSAGES } from '../constants/messages.js';

jest.mock('../entities/repos.js', () => ({
  lessonRepo: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  },
  courseRepo: {
    findOne: jest.fn(),
  },
}));

const mockedLessonRepo = jest.mocked(lessonRepo);
const mockedCourseRepo = jest.mocked(courseRepo);

const adminContext = {
  user: { user_id: 'admin-1', role: 'Admin' },
  req: {} as any,
  res: {} as any,
} as any;

const instructorContext = {
  user: { user_id: 'instructor-1', role: 'Instructor' },
  req: {} as any,
  res: {} as any,
} as any;

function buildCourse(overrides: Record<string, unknown> = {}) {
  return {
    courseId: 'course-1',
    courseName: 'Test Course',
    lessons: [],
    ...overrides,
  } as any;
}

describe('Lessons controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addLessonToCourse', () => {
    const args = {
      input: {
        courseId: 'course-1',
        lessonName: 'Lesson 1',
        description: 'Description',
        videoLink: 'https://video.test/1',
      },
    } as any;

    it('adds a lesson as an admin', async () => {
      mockedCourseRepo.findOne.mockResolvedValue(
        buildCourse({ lessons: [{ lessonId: 'existing' }] }) as any
      );
      mockedLessonRepo.create.mockReturnValue({ lessonId: 'lesson-1' } as any);

      const result = await addLessonToCourse(args, adminContext);

      expect(result.message).toContain('Test Course');
      expect(mockedLessonRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ sortOrder: 2 })
      );
      expect(mockedLessonRepo.save).toHaveBeenCalledWith({
        lessonId: 'lesson-1',
      });
    });

    it('adds a lesson to a course owned by the instructor', async () => {
      mockedCourseRepo.findOne.mockResolvedValue(buildCourse() as any);
      mockedLessonRepo.create.mockReturnValue({ lessonId: 'lesson-1' } as any);

      const result = await addLessonToCourse(args, instructorContext);

      expect(result.message).toContain('Test Course');
      expect(mockedCourseRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdBy: { userId: 'instructor-1' },
          }),
        })
      );
    });

    it('rejects missing course id or lesson name', async () => {
      await expect(
        addLessonToCourse({ input: {} } as any, adminContext)
      ).rejects.toThrow(ERROR_MESSAGES.LESSON_NOT_CREATED);
    });

    it('rejects a course the caller cannot access', async () => {
      mockedCourseRepo.findOne.mockResolvedValue(null);

      await expect(addLessonToCourse(args, instructorContext)).rejects.toThrow(
        ERROR_MESSAGES.FAILED_TO_FETCH_COURSES
      );
    });

    it('rejects a caller without a role or user id', async () => {
      await expect(
        addLessonToCourse(args, { user: { user_id: null, role: null } } as any)
      ).rejects.toThrow(ERROR_MESSAGES.FAILED_TO_FETCH_COURSES);
    });
  });

  describe('editLessonInCourse', () => {
    const args = {
      input: {
        courseId: 'course-1',
        lessonId: 'lesson-1',
        lessonName: 'Updated Lesson',
        description: 'Updated description',
        videoLink: 'https://video.test/2',
      },
    } as any;

    it('updates a lesson owned by the instructor', async () => {
      const lesson = {
        lessonName: 'Old',
        description: 'Old description',
        videoLink: 'https://old',
      };
      mockedLessonRepo.findOne.mockResolvedValue(lesson as any);

      const result = await editLessonInCourse(args, instructorContext);

      expect(result.message).toBe(
        'Lesson Updated Lesson. updated successfully'
      );
      expect(lesson).toEqual({
        lessonName: 'Updated Lesson',
        description: 'Updated description',
        videoLink: 'https://video.test/2',
      });
      expect(mockedLessonRepo.save).toHaveBeenCalledWith(lesson as any);
    });

    it('rejects missing ids', async () => {
      await expect(
        editLessonInCourse(
          { input: { courseId: 'course-1' } } as any,
          adminContext
        )
      ).rejects.toThrow(ERROR_MESSAGES.LESSON_NOT_FOUND);
    });

    it('rejects an unauthenticated caller', async () => {
      await expect(
        editLessonInCourse(args, { user: null } as any)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
    });

    it('rejects a lesson that cannot be found', async () => {
      mockedLessonRepo.findOne.mockResolvedValue(null);

      await expect(editLessonInCourse(args, instructorContext)).rejects.toThrow(
        ERROR_MESSAGES.LESSON_NOT_FOUND
      );
    });
  });

  describe('deleteLessonInCourse', () => {
    const args = {
      input: { courseId: 'course-1', lessonId: 'lesson-1' },
    } as any;

    it('deletes a lesson owned by the instructor', async () => {
      const lesson = { lessonName: 'Lesson 1' };
      mockedLessonRepo.findOne.mockResolvedValue(lesson as any);

      const result = await deleteLessonInCourse(args, instructorContext);

      expect(result.message).toBe('Lesson Lesson 1. deleted successfully');
      expect(mockedLessonRepo.remove).toHaveBeenCalledWith(lesson as any);
    });

    it('rejects missing ids', async () => {
      await expect(
        deleteLessonInCourse({ input: {} } as any, adminContext)
      ).rejects.toThrow(ERROR_MESSAGES.LESSON_NOT_FOUND);
    });

    it('rejects an unauthenticated caller', async () => {
      await expect(
        deleteLessonInCourse(args, { user: null } as any)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
    });

    it('rejects a lesson that cannot be found', async () => {
      mockedLessonRepo.findOne.mockResolvedValue(null);

      await expect(
        deleteLessonInCourse(args, instructorContext)
      ).rejects.toThrow(ERROR_MESSAGES.LESSON_NOT_FOUND);
    });
  });
});
