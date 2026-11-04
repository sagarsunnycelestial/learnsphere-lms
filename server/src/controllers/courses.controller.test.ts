/* eslint-disable */

import {
  createACourse,
  fetchAllCourses,
  editCourseDetails,
  deleteCourseFromDB,
  fetchASingleCourse,
  enrollAStudent,
  unEnrollFromCourse,
} from './courses.controller.js';
import { userRepo, courseRepo, enrollmentRepo } from '../entities/repos.js';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { ERROR_MESSAGES } from '../constants/messages.js';

jest.mock('../entities/repos.js', () => ({
  userRepo: { findOne: jest.fn() },
  courseRepo: {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  },
  enrollmentRepo: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  },
}));

const mockedUserRepo = jest.mocked(userRepo);
const mockedCourseRepo = jest.mocked(courseRepo);
const mockedEnrollmentRepo = jest.mocked(enrollmentRepo);

const instructorContext = {
  user: { user_id: 'instructor-1', role: 'Instructor' },
  req: {} as any,
  res: {} as any,
} as any;

const adminContext = {
  user: { user_id: 'admin-1', role: 'Admin' },
  req: {} as any,
  res: {} as any,
} as any;

function buildCourse(overrides: Record<string, unknown> = {}) {
  return {
    courseId: 'course-1',
    courseName: 'Test Course',
    description: 'Test description',
    thumbnail_image_path: '/thumb.png',
    isActive: true,
    createdBy: { userId: 'instructor-1' },
    lessons: [],
    quizzes: [],
    enrollments: [],
    ...overrides,
  } as any;
}

describe('Courses controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createACourse', () => {
    const args = {
      input: {
        courseName: 'New Course',
        description: 'Description',
        thumbnail_image_path: '/thumb.png',
      },
    } as any;

    it('creates a course for the authenticated user', async () => {
      const creatingUser = { userId: 'instructor-1' };
      const created = { courseId: 'course-1' };
      mockedUserRepo.findOne.mockResolvedValue(creatingUser as any);
      mockedCourseRepo.create.mockReturnValue(created as any);

      const result = await createACourse(args, instructorContext);

      expect(result.message).toBe('Course created successfully');
      expect(mockedCourseRepo.save).toHaveBeenCalledWith(created);
    });

    it('rejects an unauthenticated caller', async () => {
      await expect(createACourse(args, { user: null } as any)).rejects.toThrow(
        ERROR_MESSAGES.UNAUTHORIZED
      );
    });

    it('rejects when the creating user is missing', async () => {
      mockedUserRepo.findOne.mockResolvedValue(null);

      await expect(createACourse(args, instructorContext)).rejects.toThrow(
        ERROR_MESSAGES.USER_NOT_FOUND
      );
    });
  });

  describe('fetchAllCourses', () => {
    it('marks enrollment and modification flags for each course', async () => {
      const courses = [
        buildCourse({
          courseId: 'course-1',
          enrollments: [{ user: { userId: 'student-1' } }],
        }),
        buildCourse({
          courseId: 'course-2',
          createdBy: { userId: 'instructor-1' },
          isActive: false,
        }),
      ];
      mockedCourseRepo.find.mockResolvedValue(courses as any);

      const result = await fetchAllCourses({}, 'student-1', 'Student');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(
        expect.objectContaining({ isEnrolled: true, canModify: false })
      );
      expect(result[1]).toEqual(
        expect.objectContaining({ isEnrolled: false, canModify: false })
      );
    });

    it('allows admins to modify every course', async () => {
      mockedCourseRepo.find.mockResolvedValue([buildCourse()] as any);

      const result = await fetchAllCourses({}, 'admin-1', 'Admin');

      expect(result[0]).toEqual(expect.objectContaining({ canModify: true }));
    });

    it('filters by active status', async () => {
      mockedCourseRepo.find.mockResolvedValue([
        buildCourse({ courseId: 'active', isActive: true }),
        buildCourse({ courseId: 'inactive', isActive: false }),
      ] as any);

      const active = await fetchAllCourses(
        { status: 'active' },
        'u',
        'Student'
      );
      const inactive = await fetchAllCourses(
        { status: 'inactive' },
        'u',
        'Student'
      );

      expect(active.map((course) => course.courseId)).toEqual(['active']);
      expect(inactive.map((course) => course.courseId)).toEqual(['inactive']);
    });

    it('throws when courses cannot be fetched', async () => {
      mockedCourseRepo.find.mockResolvedValue(null as any);

      await expect(fetchAllCourses({}, 'u', 'Student')).rejects.toThrow(
        ERROR_MESSAGES.COURSES_NOT_FOUND
      );
    });
  });

  describe('editCourseDetails', () => {
    const args = {
      input: {
        courseId: 'course-1',
        courseName: 'Updated',
        description: 'Updated description',
        thumbnail_image_path: '/new.png',
        isActive: false,
      },
    } as any;

    it('updates an owned course', async () => {
      const course = buildCourse();
      mockedCourseRepo.findOne.mockResolvedValue(course as any);

      const result = await editCourseDetails(args, instructorContext);

      expect(result.message).toBe('Course edited successfully');
      expect(course).toEqual(
        expect.objectContaining({
          courseName: 'Updated',
          description: 'Updated description',
          thumbnail_image_path: '/new.png',
          isActive: false,
        })
      );
      expect(mockedCourseRepo.save).toHaveBeenCalledWith(course);
    });

    it('reactivates a course when isActive is not false', async () => {
      const course = buildCourse({ isActive: false });
      mockedCourseRepo.findOne.mockResolvedValue(course as any);

      await editCourseDetails(
        { input: { ...args.input, isActive: true } } as any,
        instructorContext
      );

      expect(course.isActive).toBe(true);
    });

    it('rejects a missing course id', async () => {
      await expect(
        editCourseDetails(
          { input: { courseName: 'x' } } as any,
          instructorContext
        )
      ).rejects.toThrow(ERROR_MESSAGES.COURSES_ID_INVALID);
    });

    it('rejects a course the caller cannot edit', async () => {
      mockedCourseRepo.findOne.mockResolvedValue(null);

      await expect(editCourseDetails(args, instructorContext)).rejects.toThrow(
        ERROR_MESSAGES.FAILED_TO_EDIT_COURSE
      );
    });
  });

  describe('deleteCourseFromDB', () => {
    it('deletes an owned course', async () => {
      const course = buildCourse();
      mockedCourseRepo.findOne.mockResolvedValue(course as any);

      const result = await deleteCourseFromDB('course-1', instructorContext);

      expect(result.message).toBe('Course deleted successfully');
      expect(mockedCourseRepo.remove).toHaveBeenCalledWith(course);
    });

    it('rejects a missing course id', async () => {
      await expect(deleteCourseFromDB('', instructorContext)).rejects.toThrow(
        ERROR_MESSAGES.COURSES_ID_INVALID
      );
    });

    it('rejects a course that is not found', async () => {
      mockedCourseRepo.findOne.mockResolvedValue(null);

      await expect(
        deleteCourseFromDB('course-1', instructorContext)
      ).rejects.toThrow(ERROR_MESSAGES.FAILED_TO_DELETE_COURSE);
    });
  });

  describe('fetchASingleCourse', () => {
    it('rejects an unknown course', async () => {
      mockedCourseRepo.findOne.mockResolvedValue(null);

      await expect(
        fetchASingleCourse('course-1', {
          user_id: 'student-1',
          role: 'Student',
        })
      ).rejects.toThrow(ERROR_MESSAGES.FAILED_TO_FETCH_COURSES);
    });

    it('hides lessons and quizzes from users who are not enrolled', async () => {
      mockedCourseRepo.findOne.mockResolvedValue(
        buildCourse({
          lessons: [{ lessonId: 'lesson-1' }],
          quizzes: [{ quizId: 'quiz-1' }],
          enrollments: [{ user: { userId: 'someone-else' } }],
        }) as any
      );

      const result = await fetchASingleCourse('course-1', {
        user_id: 'student-1',
        role: 'Student',
      });

      expect(result).toEqual(
        expect.objectContaining({
          lessons: [],
          quizzes: [],
          enrollments: [],
          totalLessons: 1,
          totalEnrolled: 1,
        })
      );
      expect(result).not.toHaveProperty('canModify');
    });

    it('returns full details to the owning instructor', async () => {
      mockedCourseRepo.findOne.mockResolvedValue(
        buildCourse({
          lessons: [{ lessonId: 'lesson-1' }],
          enrollments: [{ user: { userId: 'student-1' } }],
        }) as any
      );

      const result = await fetchASingleCourse('course-1', {
        user_id: 'instructor-1',
        role: 'Instructor',
      });

      expect(result).toEqual(
        expect.objectContaining({
          canModify: true,
          totalLessons: 1,
          totalEnrolled: 1,
        })
      );
    });

    it('returns enrolled details for an enrolled student', async () => {
      mockedCourseRepo.findOne.mockResolvedValue(
        buildCourse({
          enrollments: [{ user: { userId: 'student-1' }, isActive: true }],
        }) as any
      );

      const result = await fetchASingleCourse('course-1', {
        user_id: 'student-1',
        role: 'Student',
      });

      expect(result).toEqual(
        expect.objectContaining({
          canModify: false,
          isEnrolled: true,
        })
      );
    });

    it('lets admins modify any course', async () => {
      mockedCourseRepo.findOne.mockResolvedValue(buildCourse() as any);

      const result = await fetchASingleCourse('course-1', {
        user_id: 'admin-1',
        role: 'Admin',
      });

      expect(result).toEqual(expect.objectContaining({ canModify: true }));
    });
  });

  describe('enrollAStudent', () => {
    const args = { input: { courseId: 'course-1' } } as any;

    it('creates a new enrollment for the current user', async () => {
      mockedCourseRepo.findOne.mockResolvedValue(buildCourse() as any);
      mockedUserRepo.findOne.mockResolvedValue({
        userId: 'student-1',
        username: 'student',
      } as any);
      mockedEnrollmentRepo.findOne.mockResolvedValue(null);
      mockedEnrollmentRepo.create.mockReturnValue({
        id: 'enrollment-1',
      } as any);

      const result = await enrollAStudent(args, {
        user: { user_id: 'student-1', role: 'Student' },
      } as any);

      expect(result.message).toBe('student enrolled successfully');
      expect(mockedEnrollmentRepo.save).toHaveBeenCalledWith({
        id: 'enrollment-1',
      } as any);
    });

    it('reactivates an inactive enrollment', async () => {
      const enrollment = { isActive: false };
      mockedCourseRepo.findOne.mockResolvedValue(buildCourse() as any);
      mockedUserRepo.findOne.mockResolvedValue({
        userId: 'student-1',
        username: 'student',
      } as any);
      mockedEnrollmentRepo.findOne.mockResolvedValue(enrollment as any);

      const result = await enrollAStudent(args, {
        user: { user_id: 'student-1', role: 'Student' },
      } as any);

      expect(enrollment.isActive).toBe(true);
      expect(result.message).toBe('student enrolled successfully');
    });

    it('rejects an already active enrollment', async () => {
      mockedCourseRepo.findOne.mockResolvedValue(buildCourse() as any);
      mockedUserRepo.findOne.mockResolvedValue({
        userId: 'student-1',
        username: 'student',
      } as any);
      mockedEnrollmentRepo.findOne.mockResolvedValue({
        isActive: true,
      } as any);

      await expect(
        enrollAStudent(args, {
          user: { user_id: 'student-1', role: 'Student' },
        } as any)
      ).rejects.toThrow(ERROR_MESSAGES.USER_ALREADY_ENROLLED);
    });

    it('rejects when the course or user is missing', async () => {
      mockedCourseRepo.findOne.mockResolvedValue(null);
      mockedUserRepo.findOne.mockResolvedValue(null);

      await expect(
        enrollAStudent(args, {
          user: { user_id: 'student-1', role: 'Student' },
        } as any)
      ).rejects.toThrow(ERROR_MESSAGES.FAILED_TO_ENROLL_USER);
    });

    it('rejects missing ids', async () => {
      await expect(
        enrollAStudent({ input: {} } as any, { user: null } as any)
      ).rejects.toThrow(ERROR_MESSAGES.FAILED_TO_ENROLL_USER);
    });
  });

  describe('unEnrollFromCourse', () => {
    const args = { input: { courseId: 'course-1' } } as any;

    it('deactivates an active enrollment', async () => {
      const enrollment = {
        isActive: true,
        user: { username: 'student' },
      };
      mockedEnrollmentRepo.findOne.mockResolvedValue(enrollment as any);

      const result = await unEnrollFromCourse(args, {
        user: { user_id: 'student-1', role: 'Student' },
      } as any);

      expect(enrollment.isActive).toBe(false);
      expect(result.message).toBe('student unenrolled successfully');
    });

    it('rejects a missing enrollment', async () => {
      mockedEnrollmentRepo.findOne.mockResolvedValue(null);

      await expect(
        unEnrollFromCourse(args, {
          user: { user_id: 'student-1', role: 'Student' },
        } as any)
      ).rejects.toThrow(ERROR_MESSAGES.FAILED_TO_UNENROLL_USER);
    });

    it('rejects missing ids', async () => {
      await expect(
        unEnrollFromCourse({ input: {} } as any, { user: null } as any)
      ).rejects.toThrow(ERROR_MESSAGES.FAILED_TO_UNENROLL_USER);
    });
  });
});
