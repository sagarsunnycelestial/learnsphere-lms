import { describe, expect, it } from 'vitest';
import formReducer, {
  addCourseFormControl,
  lessonFormControl,
  questionFormControl,
  quizFormControl,
  resultDisplay,
  storeInfo,
  userAddFormControl,
} from './formSlice';

describe('formSlice', () => {
  it('starts with every dialog closed', () => {
    const state = formReducer(undefined, { type: '@@INIT' });

    expect(state.users.isUserAddFormOpen).toBe(false);
    expect(state.courses.isAddCourseFormOpen).toBe(false);
    expect(state.lessons.isLessonFormOpen).toBe(false);
    expect(state.quizzes.isQuizFormOpen).toBe(false);
    expect(state.questions.isQuestionFormOpen).toBe(false);
    expect(state.results.submitted).toBe(false);
  });

  it('controls the user form', () => {
    const state = formReducer(
      undefined,
      userAddFormControl({
        mode: 'edit',
        isUserAddFormOpen: true,
        selectedUser: { userName: 'user' },
      })
    );

    expect(state.users.mode).toBe('edit');
    expect(state.users.isUserAddFormOpen).toBe(true);
    expect(state.users.selectedUser).toEqual({ userName: 'user' });
  });

  it('stores created user credentials', () => {
    const state = formReducer(
      undefined,
      storeInfo({
        email: 'new@test.com',
        pswrd: 'temp1234',
        open: true,
      })
    );

    expect(state.users.createdUser).toEqual({
      email: 'new@test.com',
      temp_password: 'temp1234',
      didValueReceive: true,
    });
  });

  it('controls the course form', () => {
    const state = formReducer(
      undefined,
      addCourseFormControl({
        mode: 'edit',
        isAddCourseFormOpen: true,
        selectedcourse: { courseId: 'course-1' },
      })
    );

    expect(state.courses.selectedcourse).toEqual({ courseId: 'course-1' });
    expect(state.courses.isAddCourseFormOpen).toBe(true);
  });

  it('controls the lesson form', () => {
    const state = formReducer(
      undefined,
      lessonFormControl({
        mode: 'edit',
        isLessonFormOpen: true,
        selectedLesson: { lessonId: 'lesson-1' },
      })
    );

    expect(state.lessons.selectedLesson).toEqual({ lessonId: 'lesson-1' });
  });

  it('controls the quiz form', () => {
    const state = formReducer(
      undefined,
      quizFormControl({
        mode: 'edit',
        isQuizFormOpen: true,
        selectedQuiz: { quizId: 'quiz-1' },
      })
    );

    expect(state.quizzes.selectedQuiz).toEqual({ quizId: 'quiz-1' });
  });

  it('controls the question form', () => {
    const state = formReducer(
      undefined,
      questionFormControl({
        mode: 'add',
        isQuestionFormOpen: true,
        quizId: 'quiz-1',
      })
    );

    expect(state.questions.quizId).toBe('quiz-1');
  });

  it('stores the submitted quiz result', () => {
    const state = formReducer(
      undefined,
      resultDisplay({
        submitted: true,
        quizResult: { resultId: 'result-1', score: 90 },
      })
    );

    expect(state.results).toEqual({
      submitted: true,
      quizResult: { resultId: 'result-1', score: 90 },
    });
  });
});
