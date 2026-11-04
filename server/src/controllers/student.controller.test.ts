/* eslint-disable */

import { fetchStudentDetails } from './student.controller.js';
import { userRepo } from '../entities/repos.js';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { ERROR_MESSAGES } from '../constants/messages.js';

jest.mock('../entities/repos.js', () => ({
  userRepo: { find: jest.fn() },
}));

const mockedUserRepo = jest.mocked(userRepo);

function buildStudent(overrides: Record<string, unknown> = {}) {
  return {
    userId: 'student-1',
    username: 'student',
    enrollments: [],
    results: [],
    ...overrides,
  };
}

describe('Student controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all students when no course filter is given', async () => {
    const students = [buildStudent()];
    mockedUserRepo.find.mockResolvedValue(students as any);

    await expect(fetchStudentDetails({})).resolves.toEqual(students);
  });

  it('marks active enrollment in the requested course', async () => {
    mockedUserRepo.find.mockResolvedValue([
      buildStudent({
        userId: 'enrolled',
        enrollments: [
          {
            isActive: true,
            course: { courseId: 'course-1' },
          },
        ],
      }),
      buildStudent({
        userId: 'inactive',
        enrollments: [
          {
            isActive: false,
            course: { courseId: 'course-1' },
          },
        ],
      }),
    ] as any);

    const result = await fetchStudentDetails({ courseId: 'course-1' });

    expect(result[0]).toEqual(expect.objectContaining({ isEnrolled: true }));
    expect(result[1]).toEqual(expect.objectContaining({ isEnrolled: false }));
  });

  it('throws when students cannot be fetched', async () => {
    mockedUserRepo.find.mockResolvedValue(null as any);

    await expect(fetchStudentDetails({})).rejects.toThrow(
      ERROR_MESSAGES.STUDENTS_NOT_FOUND
    );
  });
});
