/* eslint-disable */

import { resolvers } from './resolvers.js';
import {
  loginUser,
  registerUserInDB,
  fetchUserByRefreshToken,
  removeRefreshToken,
  googleLoginWithFB,
} from '../controllers/auth.controller.js';
import {
  updateUserDetails,
  fetchUserProfile,
} from '../controllers/users.controller.js';
import { fetchRolesfromDB } from '../controllers/roles.controller.js';
import {
  createACourse,
  fetchAllCourses,
  editCourseDetails,
  deleteCourseFromDB,
  fetchASingleCourse,
  enrollAStudent,
  unEnrollFromCourse,
} from '../controllers/courses.controller.js';
import {
  createAQuizForCourse,
  createAQuestionForQuiz,
  submitQuizAnswers,
  deleteQuizWithID,
  deleteQuestionWithID,
} from '../controllers/quiz.controller.js';
import { fetchStudentDetails } from '../controllers/student.controller.js';
import {
  addLessonToCourse,
  editLessonInCourse,
  deleteLessonInCourse,
} from '../controllers/lessons.controller.js';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { ERROR_MESSAGES } from '../constants/messages.js';

jest.mock('../controllers/auth.controller.js', () => ({
  loginUser: jest.fn(),
  registerUserInDB: jest.fn(),
  fetchUserByRefreshToken: jest.fn(),
  removeRefreshToken: jest.fn(),
  googleLoginWithFB: jest.fn(),
}));
jest.mock('../controllers/users.controller.js', () => ({
  updateUserDetails: jest.fn(),
  fetchUserProfile: jest.fn(),
}));
jest.mock('../controllers/roles.controller.js', () => ({
  fetchRolesfromDB: jest.fn(),
}));
jest.mock('../controllers/courses.controller.js', () => ({
  createACourse: jest.fn(),
  fetchAllCourses: jest.fn(),
  editCourseDetails: jest.fn(),
  deleteCourseFromDB: jest.fn(),
  fetchASingleCourse: jest.fn(),
  enrollAStudent: jest.fn(),
  unEnrollFromCourse: jest.fn(),
}));
jest.mock('../controllers/quiz.controller.js', () => ({
  createAQuizForCourse: jest.fn(),
  createAQuestionForQuiz: jest.fn(),
  submitQuizAnswers: jest.fn(),
  deleteQuizWithID: jest.fn(),
  deleteQuestionWithID: jest.fn(),
}));
jest.mock('../controllers/student.controller.js', () => ({
  fetchStudentDetails: jest.fn(),
}));
jest.mock('../controllers/lessons.controller.js', () => ({
  addLessonToCourse: jest.fn(),
  editLessonInCourse: jest.fn(),
  deleteLessonInCourse: jest.fn(),
}));

const mockedLoginUser = jest.mocked(loginUser);
const mockedRegisterUserInDB = jest.mocked(registerUserInDB);
const mockedFetchUserByRefreshToken = jest.mocked(fetchUserByRefreshToken);
const mockedRemoveRefreshToken = jest.mocked(removeRefreshToken);
const mockedGoogleLoginWithFB = jest.mocked(googleLoginWithFB);
const mockedUpdateUserDetails = jest.mocked(updateUserDetails);
const mockedFetchUserProfile = jest.mocked(fetchUserProfile);
const mockedFetchRolesfromDB = jest.mocked(fetchRolesfromDB);
const mockedCreateACourse = jest.mocked(createACourse);
const mockedFetchAllCourses = jest.mocked(fetchAllCourses);
const mockedEditCourseDetails = jest.mocked(editCourseDetails);
const mockedDeleteCourseFromDB = jest.mocked(deleteCourseFromDB);
const mockedFetchASingleCourse = jest.mocked(fetchASingleCourse);
const mockedEnrollAStudent = jest.mocked(enrollAStudent);
const mockedUnEnrollFromCourse = jest.mocked(unEnrollFromCourse);
const mockedCreateAQuizForCourse = jest.mocked(createAQuizForCourse);
const mockedCreateAQuestionForQuiz = jest.mocked(createAQuestionForQuiz);
const mockedSubmitQuizAnswers = jest.mocked(submitQuizAnswers);
const mockedDeleteQuizWithID = jest.mocked(deleteQuizWithID);
const mockedDeleteQuestionWithID = jest.mocked(deleteQuestionWithID);
const mockedFetchStudentDetails = jest.mocked(fetchStudentDetails);
const mockedAddLessonToCourse = jest.mocked(addLessonToCourse);
const mockedEditLessonInCourse = jest.mocked(editLessonInCourse);
const mockedDeleteLessonInCourse = jest.mocked(deleteLessonInCourse);

const admin = { user: { user_id: 'admin-1', role: 'Admin' } } as any;
const instructor = {
  user: { user_id: 'instructor-1', role: 'Instructor' },
} as any;
const student = { user: { user_id: 'student-1', role: 'Student' } } as any;

describe('Resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query', () => {
    it('fetchProfile rejects unauthenticated callers', async () => {
      await expect(
        resolvers.Query.fetchProfile({}, {}, { user: null } as any)
      ).rejects.toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
    });

    it('fetchProfile delegates to the controller', async () => {
      mockedFetchUserProfile.mockResolvedValue({ userId: 'admin-1' } as any);

      const result = await resolvers.Query.fetchProfile({}, {}, admin);

      expect(result).toEqual({ userId: 'admin-1' });
      expect(mockedFetchUserProfile).toHaveBeenCalledWith('admin-1');
    });

    it('fetchRoles rejects non-admins', async () => {
      await expect(
        resolvers.Query.fetchRoles({}, {}, instructor)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
      await expect(
        resolvers.Query.fetchRoles({}, {}, { user: null } as any)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
    });

    it('fetchRoles delegates for admins', async () => {
      mockedFetchRolesfromDB.mockResolvedValue([{ roleId: '1' }] as any);

      await expect(resolvers.Query.fetchRoles({}, {}, admin)).resolves.toEqual([
        { roleId: '1' },
      ]);
    });

    it('refreshEndpoint rejects a missing cookie', async () => {
      await expect(
        resolvers.Query.refreshEndpoint({}, {}, { req: { cookies: {} } } as any)
      ).rejects.toThrow(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
    });

    it('refreshEndpoint delegates with the refresh token', async () => {
      mockedFetchUserByRefreshToken.mockResolvedValue({
        accessToken: 'token',
      } as any);

      const result = await resolvers.Query.refreshEndpoint({}, {}, {
        req: { cookies: { refresh_token: 'refresh' } },
      } as any);

      expect(result).toEqual({ accessToken: 'token' });
      expect(mockedFetchUserByRefreshToken).toHaveBeenCalledWith('refresh');
    });

    it('fetchCourses rejects unauthenticated callers', async () => {
      await expect(
        resolvers.Query.fetchCourses({}, { filter: { status: 'active' } }, {
          user: null,
        } as any)
      ).rejects.toThrow(ERROR_MESSAGES.COURSES_NOT_FOUND);
    });

    it('fetchCourses delegates with filter and identity', async () => {
      mockedFetchAllCourses.mockResolvedValue([] as any);

      await resolvers.Query.fetchCourses(
        {},
        { filter: { status: 'active' } },
        student
      );

      expect(mockedFetchAllCourses).toHaveBeenCalledWith(
        { status: 'active' },
        'student-1',
        'Student'
      );
    });

    it('fetchCourseById rejects unauthenticated callers', async () => {
      await expect(
        resolvers.Query.fetchCourseById({}, { courseId: 'c1' }, {
          user: null,
        } as any)
      ).rejects.toThrow(ERROR_MESSAGES.COURSES_NOT_FOUND);
    });

    it('fetchCourseById delegates to the controller', async () => {
      mockedFetchASingleCourse.mockResolvedValue({ courseId: 'c1' } as any);

      await resolvers.Query.fetchCourseById({}, { courseId: 'c1' }, student);

      expect(mockedFetchASingleCourse).toHaveBeenCalledWith('c1', student.user);
    });

    it('fetchStudents blocks students and anonymous callers', async () => {
      await expect(
        resolvers.Query.fetchStudents({}, {}, student)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
      await expect(
        resolvers.Query.fetchStudents({}, {}, { user: null } as any)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
    });

    it('fetchStudents delegates for instructors', async () => {
      mockedFetchStudentDetails.mockResolvedValue([] as any);

      await resolvers.Query.fetchStudents({}, { courseId: 'c1' }, instructor);

      expect(mockedFetchStudentDetails).toHaveBeenCalledWith({
        courseId: 'c1',
      });
    });
  });

  describe('Mutation', () => {
    it('login delegates to the controller', async () => {
      mockedLoginUser.mockResolvedValue({ accessToken: 'token' } as any);
      const res = {} as any;

      const result = await resolvers.Mutation.login(
        {},
        { input: { email: 'a', password: 'b' } },
        { res } as any
      );

      expect(result).toEqual({ accessToken: 'token' });
      expect(mockedLoginUser).toHaveBeenCalledWith(
        { input: { email: 'a', password: 'b' } },
        res
      );
    });

    it('registerUser blocks non-admins', async () => {
      await expect(
        resolvers.Mutation.registerUser({}, {} as any, instructor)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
    });

    it('registerUser delegates for admins', async () => {
      mockedRegisterUserInDB.mockResolvedValue({ message: 'ok' } as any);

      await resolvers.Mutation.registerUser({}, {} as any, admin);

      expect(mockedRegisterUserInDB).toHaveBeenCalledWith(
        {} as any,
        admin.user
      );
    });

    it('updateProfile rejects anonymous callers', async () => {
      await expect(
        resolvers.Mutation.updateProfile({}, {} as any, { user: null } as any)
      ).rejects.toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
    });

    it('updateProfile delegates for authenticated callers', async () => {
      mockedUpdateUserDetails.mockResolvedValue({ message: 'ok' } as any);

      await resolvers.Mutation.updateProfile({}, {} as any, student);

      expect(mockedUpdateUserDetails).toHaveBeenCalledWith(
        {} as any,
        student.user
      );
    });

    it('logout rejects anonymous callers', async () => {
      await expect(
        resolvers.Mutation.logout({}, {}, {
          res: {},
          user: null,
        } as any)
      ).rejects.toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
    });

    it('logout clears the refresh cookie', async () => {
      mockedRemoveRefreshToken.mockResolvedValue({ message: 'ok' } as any);
      const res = { clearCookie: jest.fn() } as any;

      const result = await resolvers.Mutation.logout({}, {}, {
        res,
        user: student.user,
      } as any);

      expect(result).toEqual({ message: 'ok' });
      expect(mockedRemoveRefreshToken).toHaveBeenCalledWith('student-1');
      expect(res.clearCookie).toHaveBeenCalledWith(
        'jwt',
        expect.objectContaining({ httpOnly: true })
      );
    });

    it('course mutations block students', async () => {
      await expect(
        resolvers.Mutation.createCourse({}, {} as any, student)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
      await expect(
        resolvers.Mutation.editCourse({}, {} as any, student)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
      await expect(
        resolvers.Mutation.deleteCourse({}, { courseId: 'c1' }, student)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
    });

    it('course mutations block anonymous callers', async () => {
      await expect(
        resolvers.Mutation.createCourse({}, {} as any, { user: null } as any)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
    });

    it('course mutations delegate for instructors', async () => {
      mockedCreateACourse.mockResolvedValue({ message: 'created' } as any);
      mockedEditCourseDetails.mockResolvedValue({ message: 'edited' } as any);
      mockedDeleteCourseFromDB.mockResolvedValue({ message: 'deleted' } as any);

      await resolvers.Mutation.createCourse({}, {} as any, instructor);
      await resolvers.Mutation.editCourse({}, {} as any, instructor);
      await resolvers.Mutation.deleteCourse({}, { courseId: 'c1' }, instructor);

      expect(mockedCreateACourse).toHaveBeenCalledWith({} as any, instructor);
      expect(mockedEditCourseDetails).toHaveBeenCalledWith(
        {} as any,
        instructor
      );
      expect(mockedDeleteCourseFromDB).toHaveBeenCalledWith('c1', instructor);
    });

    it('enrollCourse blocks instructors and delegates for students', async () => {
      await expect(
        resolvers.Mutation.enrollCourse({}, {} as any, instructor)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);

      mockedEnrollAStudent.mockResolvedValue({ message: 'ok' } as any);
      await resolvers.Mutation.enrollCourse({}, {} as any, student);

      expect(mockedEnrollAStudent).toHaveBeenCalledWith({} as any, student);
    });

    it('lesson mutations block students', async () => {
      await expect(
        resolvers.Mutation.addALesson({}, {} as any, student)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
      await expect(
        resolvers.Mutation.editALesson({}, {} as any, student)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
      await expect(
        resolvers.Mutation.deleteALesson({}, {} as any, student)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
    });

    it('lesson mutations delegate for instructors', async () => {
      mockedAddLessonToCourse.mockResolvedValue({ message: 'added' } as any);
      mockedEditLessonInCourse.mockResolvedValue({ message: 'edited' } as any);
      mockedDeleteLessonInCourse.mockResolvedValue({
        message: 'deleted',
      } as any);

      await resolvers.Mutation.addALesson({}, {} as any, instructor);
      await resolvers.Mutation.editALesson({}, {} as any, instructor);
      await resolvers.Mutation.deleteALesson({}, {} as any, instructor);

      expect(mockedAddLessonToCourse).toHaveBeenCalledWith(
        {} as any,
        instructor
      );
      expect(mockedEditLessonInCourse).toHaveBeenCalledWith(
        {} as any,
        instructor
      );
      expect(mockedDeleteLessonInCourse).toHaveBeenCalledWith(
        {} as any,
        instructor
      );
    });

    it('quiz creation blocks students', async () => {
      await expect(
        resolvers.Mutation.createAQuiz({}, {} as any, student)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
      await expect(
        resolvers.Mutation.createAQuestion({}, {} as any, student)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
    });

    it('quiz creation delegates for instructors', async () => {
      mockedCreateAQuizForCourse.mockResolvedValue({ message: 'ok' } as any);
      mockedCreateAQuestionForQuiz.mockResolvedValue({ message: 'ok' } as any);

      await resolvers.Mutation.createAQuiz({}, {} as any, instructor);
      await resolvers.Mutation.createAQuestion({}, {} as any, instructor);

      expect(mockedCreateAQuizForCourse).toHaveBeenCalledWith(
        {} as any,
        instructor
      );
      expect(mockedCreateAQuestionForQuiz).toHaveBeenCalledWith(
        {} as any,
        instructor
      );
    });

    it('submitQuiz requires a student', async () => {
      await expect(
        resolvers.Mutation.submitQuiz({}, {} as any, instructor)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);

      mockedSubmitQuizAnswers.mockResolvedValue({ score: 100 } as any);
      const result = await resolvers.Mutation.submitQuiz(
        {},
        {} as any,
        student
      );

      expect(result).toEqual({ score: 100 });
      expect(mockedSubmitQuizAnswers).toHaveBeenCalledWith({} as any, student);
    });

    it('quiz deletion blocks students and anonymous callers', async () => {
      await expect(
        resolvers.Mutation.deleteQuiz({}, { quizId: 'q1' }, student)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
      await expect(
        resolvers.Mutation.deleteQuiz({}, { quizId: 'q1' }, {
          user: null,
        } as any)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
      await expect(
        resolvers.Mutation.deleteQuestion(
          {},
          { questionId: 'q', quizId: 'z' },
          student
        )
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
    });

    it('quiz deletion delegates for instructors', async () => {
      mockedDeleteQuizWithID.mockResolvedValue({ message: 'ok' } as any);
      mockedDeleteQuestionWithID.mockResolvedValue({ message: 'ok' } as any);

      await resolvers.Mutation.deleteQuiz({}, { quizId: 'q1' }, instructor);
      await resolvers.Mutation.deleteQuestion(
        {},
        { questionId: 'q1', quizId: 'z1' },
        instructor
      );

      expect(mockedDeleteQuizWithID).toHaveBeenCalledWith('q1', instructor);
      expect(mockedDeleteQuestionWithID).toHaveBeenCalledWith({
        questionId: 'q1',
        quizId: 'z1',
        userId: 'instructor-1',
      });
    });

    it('unenrollStudent blocks instructors and delegates for students', async () => {
      await expect(
        resolvers.Mutation.unenrollStudent({}, {} as any, instructor)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);

      mockedUnEnrollFromCourse.mockResolvedValue({ message: 'ok' } as any);
      await resolvers.Mutation.unenrollStudent({}, {} as any, student);

      expect(mockedUnEnrollFromCourse).toHaveBeenCalledWith({} as any, student);
    });

    it('googleLogin delegates with the id token and response', async () => {
      mockedGoogleLoginWithFB.mockResolvedValue({
        accessToken: 'google',
      } as any);
      const res = {} as any;

      const result = await resolvers.Mutation.googleLogin(
        {},
        { input: { idToken: 'id-token' } },
        { res } as any
      );

      expect(result).toEqual({ accessToken: 'google' });
      expect(mockedGoogleLoginWithFB).toHaveBeenCalledWith('id-token', res);
    });
  });
});
