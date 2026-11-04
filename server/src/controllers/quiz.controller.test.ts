/* eslint-disable */

import {
  createAQuizForCourse,
  createAQuestionForQuiz,
  submitQuizAnswers,
  deleteQuizWithID,
  deleteQuestionWithID,
} from './quiz.controller.js';
import {
  userRepo,
  courseRepo,
  questionRepo,
  quizRepo,
  resultRepo,
  optionRepo,
} from '../entities/repos.js';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { ERROR_MESSAGES } from '../constants/messages.js';

jest.mock('../entities/repos.js', () => ({
  userRepo: { findOne: jest.fn(), save: jest.fn() },
  courseRepo: { findOne: jest.fn() },
  questionRepo: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  },
  quizRepo: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  },
  resultRepo: { create: jest.fn(), save: jest.fn() },
  optionRepo: { create: jest.fn(), save: jest.fn() },
}));

const mockedUserRepo = jest.mocked(userRepo);
const mockedCourseRepo = jest.mocked(courseRepo);
const mockedQuestionRepo = jest.mocked(questionRepo);
const mockedQuizRepo = jest.mocked(quizRepo);
const mockedResultRepo = jest.mocked(resultRepo);
const mockedOptionRepo = jest.mocked(optionRepo);

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

describe('Quiz controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAQuizForCourse', () => {
    const args = { input: { courseId: 'course-1', quizName: 'Quiz 1' } };

    it('creates a quiz for an owned course', async () => {
      const course = { courseId: 'course-1' };
      mockedCourseRepo.findOne.mockResolvedValue(course as any);
      mockedQuizRepo.create.mockReturnValue({ quizId: 'quiz-1' } as any);

      const result = await createAQuizForCourse(args, instructorContext);

      expect(result.message).toBe('Quiz created successfully');
      expect(mockedQuizRepo.create).toHaveBeenCalledWith({
        quizName: 'Quiz 1',
        course,
      });
      expect(mockedQuizRepo.save).toHaveBeenCalledWith({ quizId: 'quiz-1' });
    });

    it('scopes the lookup for non-admin users', async () => {
      mockedCourseRepo.findOne.mockResolvedValue({} as any);
      mockedQuizRepo.create.mockReturnValue({} as any);

      await createAQuizForCourse(args, instructorContext);

      expect(mockedCourseRepo.findOne).toHaveBeenCalledWith({
        where: {
          courseId: 'course-1',
          createdBy: { userId: 'instructor-1' },
        },
      });
    });

    it('does not scope the lookup for admins', async () => {
      mockedCourseRepo.findOne.mockResolvedValue({} as any);
      mockedQuizRepo.create.mockReturnValue({} as any);

      await createAQuizForCourse(args, adminContext);

      expect(mockedCourseRepo.findOne).toHaveBeenCalledWith({
        where: { courseId: 'course-1' },
      });
    });

    it('rejects missing user or course id', async () => {
      await expect(
        createAQuizForCourse(args, { user: null } as any)
      ).rejects.toThrow(ERROR_MESSAGES.COURSES_ID_INVALID);
    });

    it('rejects a course that cannot be found', async () => {
      mockedCourseRepo.findOne.mockResolvedValue(null);

      await expect(
        createAQuizForCourse(args, instructorContext)
      ).rejects.toThrow(ERROR_MESSAGES.COURSES_NOT_FOUND);
    });
  });

  describe('createAQuestionForQuiz', () => {
    const args = {
      input: {
        quizId: 'quiz-1',
        questionText: 'Question?',
        correctOption: 'Correct',
        options: ['Correct', 'Wrong'],
      },
    } as any;

    it('creates a question with options', async () => {
      const quiz = { quizId: 'quiz-1' };
      const question = { questionId: 'question-1' };
      const correctOption = { optionId: 'option-correct' };
      mockedQuizRepo.findOne.mockResolvedValue(quiz as any);
      mockedQuestionRepo.create.mockReturnValue(question as any);
      mockedOptionRepo.create
        .mockReturnValueOnce(correctOption as any)
        .mockReturnValueOnce({ optionId: 'option-1' } as any)
        .mockReturnValueOnce({ optionId: 'option-2' } as any);

      const result = await createAQuestionForQuiz(args, instructorContext);

      expect(result.message).toBe('Question and options created successfully');
      expect(mockedOptionRepo.save).toHaveBeenCalledWith([
        { optionId: 'option-1' },
        { optionId: 'option-2' },
        correctOption,
      ]);
      expect(question).toEqual(expect.objectContaining({ correctOption }));
    });

    it('rejects missing user or quiz id', async () => {
      await expect(
        createAQuestionForQuiz(args, { user: null } as any)
      ).rejects.toThrow(ERROR_MESSAGES.QUIZ_ID_INVALID);
    });

    it('rejects missing question text or correct option', async () => {
      await expect(
        createAQuestionForQuiz(
          { input: { quizId: 'quiz-1', options: [] } } as any,
          instructorContext
        )
      ).rejects.toThrow(ERROR_MESSAGES.QUESTION_NOT_CREATED);
    });

    it('rejects an unknown quiz', async () => {
      mockedQuizRepo.findOne.mockResolvedValue(null);

      await expect(
        createAQuestionForQuiz(args, instructorContext)
      ).rejects.toThrow(ERROR_MESSAGES.QUESTION_NOT_CREATED);
    });
  });

  describe('submitQuizAnswers', () => {
    const studentContext = {
      user: { user_id: 'student-1', role: 'Student' },
      req: {} as any,
      res: {} as any,
    } as any;

    function buildQuiz() {
      return {
        quizId: 'quiz-1',
        quizName: 'Quiz 1',
        course: {
          courseId: 'course-1',
          courseName: 'Course 1',
          isActive: true,
        },
        questions: [
          {
            questionId: 'question-1',
            correctOption: { optionId: 'option-1' },
            options: [],
          },
          {
            questionId: 'question-2',
            correctOption: { optionId: 'option-2' },
            options: [],
          },
        ],
      };
    }

    function buildUser() {
      return {
        userId: 'student-1',
        username: 'student',
        profile_image_path: '/avatar.png',
        results: [],
      };
    }

    it('scores a submitted quiz', async () => {
      const user = buildUser();
      const quiz = buildQuiz();
      const quizResult = { resultId: 'result-1', score: 50 };
      mockedUserRepo.findOne.mockResolvedValue(user as any);
      mockedQuizRepo.findOne.mockResolvedValue(quiz as any);
      mockedResultRepo.create.mockReturnValue(quizResult as any);
      mockedResultRepo.save.mockResolvedValue(quizResult as any);

      const result = await submitQuizAnswers(
        {
          input: {
            quizId: 'quiz-1',
            answerList: [
              { questionId: 'question-1', selectionOption: 'option-1' },
              { questionId: 'question-2', selectionOption: 'wrong' },
            ],
          },
        },
        studentContext
      );

      expect(result.score).toBe(50);
      expect(result.courseDetail).toEqual(quiz.course);
      expect(result.resultId).toBe('result-1');
      expect(mockedUserRepo.save).toHaveBeenCalledWith(user);
    });

    it('scores zero when every answer is wrong', async () => {
      mockedUserRepo.findOne.mockResolvedValue(buildUser() as any);
      mockedQuizRepo.findOne.mockResolvedValue(buildQuiz() as any);
      mockedResultRepo.create.mockReturnValue({
        resultId: 'result-1',
        score: 0,
      } as any);

      const result = await submitQuizAnswers(
        {
          input: {
            quizId: 'quiz-1',
            answerList: [{ questionId: 'question-1', selectionOption: 'nope' }],
          },
        },
        studentContext
      );

      expect(result.score).toBe(0);
    });

    it('rejects missing user or quiz id', async () => {
      await expect(
        submitQuizAnswers(
          { input: { quizId: 'quiz-1' } } as any,
          { user: null } as any
        )
      ).rejects.toThrow(ERROR_MESSAGES.QUIZ_ID_INVALID);
    });

    it('rejects an empty answer list', async () => {
      mockedUserRepo.findOne.mockResolvedValue(buildUser() as any);

      await expect(
        submitQuizAnswers(
          { input: { quizId: 'quiz-1', answerList: [] } } as any,
          studentContext
        )
      ).rejects.toThrow(ERROR_MESSAGES.QUIZ_SUBMIT_FAILED);
    });

    it('rejects duplicate answers', async () => {
      mockedUserRepo.findOne.mockResolvedValue(buildUser() as any);

      await expect(
        submitQuizAnswers(
          {
            input: {
              quizId: 'quiz-1',
              answerList: [
                { questionId: 'question-1', selectionOption: 'option-1' },
                { questionId: 'question-1', selectionOption: 'option-2' },
              ],
            },
          } as any,
          studentContext
        )
      ).rejects.toThrow(ERROR_MESSAGES.QUIZ_HAS_DUPLICATES);
    });

    it('rejects an unknown user', async () => {
      mockedUserRepo.findOne.mockResolvedValue(null);

      await expect(
        submitQuizAnswers(
          {
            input: {
              quizId: 'quiz-1',
              answerList: [{ questionId: 'question-1' }],
            },
          } as any,
          studentContext
        )
      ).rejects.toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
    });

    it('rejects an unknown quiz', async () => {
      mockedUserRepo.findOne.mockResolvedValue(buildUser() as any);
      mockedQuizRepo.findOne.mockResolvedValue(null);

      await expect(
        submitQuizAnswers(
          {
            input: {
              quizId: 'quiz-1',
              answerList: [{ questionId: 'question-1' }],
            },
          } as any,
          studentContext
        )
      ).rejects.toThrow(ERROR_MESSAGES.QUIZ_ID_INVALID);
    });
  });

  describe('deleteQuizWithID', () => {
    it('deletes a quiz owned by the instructor', async () => {
      const quiz = { quizId: 'quiz-1' };
      mockedQuizRepo.findOne.mockResolvedValue(quiz as any);

      const result = await deleteQuizWithID('quiz-1', instructorContext);

      expect(result.message).toBe('Quiz deleted successfully');
      expect(mockedQuizRepo.remove).toHaveBeenCalledWith(quiz as any);
    });

    it('rejects an unauthenticated caller', async () => {
      await expect(
        deleteQuizWithID('quiz-1', { user: null } as any)
      ).rejects.toThrow(ERROR_MESSAGES.QUIZ_NOT_FOUND);
    });

    it('rejects an unknown quiz', async () => {
      mockedQuizRepo.findOne.mockResolvedValue(null);

      await expect(
        deleteQuizWithID('quiz-1', instructorContext)
      ).rejects.toThrow(ERROR_MESSAGES.QUIZ_NOT_FOUND);
    });
  });

  describe('deleteQuestionWithID', () => {
    it('deletes a question', async () => {
      const question = { questionId: 'question-1' };
      mockedQuestionRepo.findOne.mockResolvedValue(question as any);

      const result = await deleteQuestionWithID({
        questionId: 'question-1',
        quizId: 'quiz-1',
        userId: 'instructor-1',
      });

      expect(result.message).toBe('Question deleted successfully');
      expect(mockedQuestionRepo.remove).toHaveBeenCalledWith(question as any);
    });

    it('rejects an unknown question', async () => {
      mockedQuestionRepo.findOne.mockResolvedValue(null);

      await expect(
        deleteQuestionWithID({
          questionId: 'question-1',
          quizId: 'quiz-1',
          userId: 'instructor-1',
        })
      ).rejects.toThrow(ERROR_MESSAGES.QUESTION_NOT_DELETE);
    });
  });
});
