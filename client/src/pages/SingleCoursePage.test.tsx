/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SingleCoursePage from './SingleCoursePage';
import { createTestStore, renderWithProviders } from '../test/render';
import { refreshUser } from '../store/slices/authSlice';
import useFetchCourseById from '../hooks/useFetchCourseById';
import { studentUser, testUser } from '../test/fixtures';
import { toast } from 'react-toastify';

const mocks = vi.hoisted(() => ({
  deleteCourse: vi.fn(),
  deleteLesson: vi.fn(),
  submitQuizAnswers: vi.fn(),
  deleteQuestion: vi.fn(),
  deleteQuiz: vi.fn(),
  unEnrollStudent: vi.fn(),
}));

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useParams: () => ({ id: 'course-1' }) };
});
vi.mock('../hooks/useFetchCourseById', () => ({ default: vi.fn() }));
vi.mock('../hooks/useCoursesCRUD', () => ({
  default: () => ({ deleteCourse: mocks.deleteCourse }),
}));
vi.mock('../hooks/useLessonsCRUD', () => ({
  default: () => ({ deleteLesson: mocks.deleteLesson }),
}));
vi.mock('../hooks/useQuizzesCRUD', () => ({
  default: () => ({
    submitQuizAnswers: mocks.submitQuizAnswers,
    deleteQuestion: mocks.deleteQuestion,
    deleteQuiz: mocks.deleteQuiz,
  }),
}));
vi.mock('../hooks/useUserCRUD', () => ({
  default: () => ({ unEnrollStudent: mocks.unEnrollStudent }),
}));
vi.mock('../components/forms/CourseForm', () => ({
  default: () => <div>Course form</div>,
}));
vi.mock('../components/forms/LessonForm', () => ({
  default: () => <div>Lesson form</div>,
}));
vi.mock('../components/forms/QuizForm', () => ({
  default: () => <div>Quiz form</div>,
}));
vi.mock('../components/forms/QuestionForm', () => ({
  default: () => <div>Question form</div>,
}));
vi.mock('../components/course/QuizResultDisplay', () => ({
  default: () => <div>Quiz result</div>,
}));
vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

const mockedUseFetchCourseById = vi.mocked(useFetchCourseById);
const mockedToast = vi.mocked(toast);

function buildCourse(overrides: Record<string, unknown> = {}) {
  return {
    courseId: 'course-1',
    courseName: 'Test Course',
    description: 'A course used in tests',
    thumbnail_image_path: '/thumb.png',
    isActive: true,
    isEnrolled: true,
    canModify: false,
    totalLessons: 2,
    totalEnrolled: 1,
    createdBy: {
      userId: 'user-1',
      username: 'admin',
      profile_image_path: '/avatar.png',
    },
    lessons: [
      {
        lessonId: 'lesson-2',
        lessonName: 'Second Lesson',
        description: 'Second description',
        videoLink: 'https://video.test/2',
        sortOrder: 2,
      },
      {
        lessonId: 'lesson-1',
        lessonName: 'First Lesson',
        description: 'First description',
        videoLink: 'https://video.test/1',
        sortOrder: 1,
      },
    ],
    quizzes: [
      {
        quizId: 'quiz-1',
        quizName: 'Quiz One',
        questions: [
          {
            questionId: 'question-1',
            questionText: 'Pick A',
            options: [
              { optionId: 'option-1', optionText: 'A' },
              { optionId: 'option-2', optionText: 'B' },
            ],
          },
        ],
      },
    ],
    enrollments: [
      {
        enrollmentId: 'enrollment-1',
        isActive: true,
        enrolledAt: 1700000000000,
        user: {
          userId: 'student-1',
          username: 'Sam Student',
          collegeName: 'Test College',
          profile_image_path: '/sam.png',
        },
      },
    ],
    ...overrides,
  };
}

function renderPage(role: string, course = buildCourse()) {
  mockedUseFetchCourseById.mockReturnValue({
    data: course,
    isLoading: false,
    error: null,
  } as any);
  const store = createTestStore();
  store.dispatch(
    refreshUser({
      ...(role === 'Student' ? studentUser : testUser),
      role,
    } as any)
  );
  renderWithProviders(<SingleCoursePage />, { store });
  return store;
}

describe('SingleCoursePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.deleteCourse.mockResolvedValue({ message: 'Course deleted' });
    mocks.deleteLesson.mockResolvedValue({ message: 'Lesson deleted' });
    mocks.submitQuizAnswers.mockResolvedValue({
      message: 'Submitted',
      score: 100,
    });
    mocks.unEnrollStudent.mockResolvedValue({ message: 'Unenrolled' });
    mocks.deleteQuiz.mockResolvedValue({ message: 'Quiz deleted' });
    mocks.deleteQuestion.mockResolvedValue({ message: 'Question deleted' });
  });

  it('shows a progress indicator while loading', () => {
    mockedUseFetchCourseById.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<SingleCoursePage />, { store: createTestStore() });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows an error state when the course fails to load', () => {
    mockedUseFetchCourseById.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('failed'),
    } as any);

    renderWithProviders(<SingleCoursePage />, { store: createTestStore() });

    expect(
      screen.getByText('An Error occurred while fetching')
    ).toBeInTheDocument();
  });

  it('renders the course summary for an enrolled student', () => {
    renderPage('Student');

    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('A course used in tests')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('2 Lessons')).toBeInTheDocument();
    expect(screen.getByText('1 Quizzes')).toBeInTheDocument();
    expect(screen.getByText('1 Students')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.queryByText('Course Controls')).not.toBeInTheDocument();
  });

  it('hides lessons and quizzes from students who are not enrolled', () => {
    renderPage('Student', buildCourse({ isEnrolled: false }));

    expect(screen.getByText('Enroll to view lessons')).toBeInTheDocument();
    expect(screen.getByText('Enroll to view quizzes')).toBeInTheDocument();
    expect(screen.queryByText(/First Lesson/)).not.toBeInTheDocument();
  });

  it('renders lessons in sort order for enrolled students', () => {
    renderPage('Student');

    expect(screen.getByText('1. First Lesson')).toBeInTheDocument();
    expect(screen.getByText('2. Second Lesson')).toBeInTheDocument();
  });

  it('shows the course controls for admins', () => {
    renderPage('Admin', buildCourse({ canModify: true }));

    expect(screen.getByText('Course Controls')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /edit course preview/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /delete entire course/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add a lesson/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add a quiz/i })
    ).toBeInTheDocument();
  });

  it('opens the lesson form from the add lesson button', async () => {
    const user = userEvent.setup();
    renderPage('Admin', buildCourse({ canModify: true }));

    await user.click(screen.getByRole('button', { name: /add a lesson/i }));

    expect(screen.getByText('Lesson form')).toBeInTheDocument();
  });

  it('deletes the course after confirmation', async () => {
    const user = userEvent.setup();
    renderPage('Admin', buildCourse({ canModify: true }));

    await user.click(
      screen.getByRole('button', { name: /delete entire course/i })
    );

    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }));

    expect(mocks.deleteCourse).toHaveBeenCalledWith({ courseId: 'course-1' });
    await waitFor(() =>
      expect(mockedToast.success).toHaveBeenCalledWith('Course deleted')
    );
  });

  it('toggles the enrolled student list and unenrolls a student', async () => {
    const user = userEvent.setup();
    renderPage('Admin', buildCourse({ canModify: true }));

    await user.click(
      screen.getByRole('button', { name: /view enrolled students/i })
    );

    expect(await screen.findByText('Sam Student')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Unenroll' }));

    expect(mocks.unEnrollStudent).toHaveBeenCalledWith({
      input: { userId: 'student-1', courseId: 'course-1' },
    });
  });

  it('deletes a lesson from the lesson menu', async () => {
    const user = userEvent.setup();
    renderPage('Admin', buildCourse({ canModify: true }));
    const menuButton = screen
      .getAllByTestId('MoreHorizIcon')[0]
      .closest('button') as HTMLElement;

    await user.click(menuButton);
    await user.click(await screen.findByText('Delete'));

    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }));

    expect(mocks.deleteLesson).toHaveBeenCalledWith({
      input: { courseId: 'course-1', lessonId: 'lesson-1' },
    });
  });

  it('submits quiz answers and shows the result', async () => {
    const user = userEvent.setup();
    const store = renderPage('Student');

    await user.click(screen.getByText('Quizzes'));
    await user.click(screen.getByRole('radio', { name: 'A' }));
    await user.click(screen.getByRole('button', { name: /submit answers/i }));

    await waitFor(() =>
      expect(mocks.submitQuizAnswers).toHaveBeenCalledWith({
        input: {
          quizId: 'quiz-1',
          answerList: [
            { questionId: 'quizId', selectionOption: 'quiz-1' },
            { questionId: 'question-1', selectionOption: 'option-1' },
          ],
        },
      })
    );
    expect(store.getState().form.results.submitted).toBe(true);
    expect(await screen.findByText('Quiz result')).toBeInTheDocument();
  });
});
