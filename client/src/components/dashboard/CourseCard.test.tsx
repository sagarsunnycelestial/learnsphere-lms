/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import CourseCard from './CourseCard';
import { createTestStore, renderWithProviders } from '../../test/render';
import { refreshUser } from '../../store/slices/authSlice';
import { studentUser, testCourse, testUser } from '../../test/fixtures';
import { toast } from 'react-toastify';

const mocks = vi.hoisted(() => ({
  deleteCourse: vi.fn(),
  enrollStudent: vi.fn(),
  students: [] as any[],
}));

vi.mock('../../hooks/useFetchStudents', () => ({
  default: () => ({ data: mocks.students }),
}));
vi.mock('../../hooks/useCoursesCRUD', () => ({
  default: () => ({ deleteCourse: mocks.deleteCourse }),
}));
vi.mock('../../hooks/useUserCRUD', () => ({
  default: () => ({ enrollStudent: mocks.enrollStudent }),
}));
vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

const mockedToast = vi.mocked(toast);

function buildCourse(overrides: Record<string, unknown> = {}) {
  return {
    ...testCourse,
    createdBy: {
      userId: 'user-1',
      username: 'admin',
      profile_image_path: '/avatar.png',
    },
    ...overrides,
  } as any;
}

function renderCard(role: string, course = buildCourse()) {
  const store = createTestStore();
  store.dispatch(
    refreshUser({
      ...(role === 'Student' ? studentUser : testUser),
      role,
    } as any)
  );
  const result = renderWithProviders(<CourseCard course={course} />, { store });
  return result;
}

function getMenuButton() {
  return screen.getByTestId('MoreHorizIcon').closest('button') as HTMLElement;
}

describe('CourseCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.students = [];
    mocks.deleteCourse.mockResolvedValue({ message: 'Course deleted' });
    mocks.enrollStudent.mockResolvedValue({
      message: 'student enrolled successfully',
    });
  });

  it('hides archived courses from unprivileged students', () => {
    const { container } = renderCard(
      'Student',
      buildCourse({ isActive: false, canModify: false })
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the course summary for an admin', () => {
    renderCard('Admin');

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('A course used in tests')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(getMenuButton()).toBeInTheDocument();
  });

  it('dispatching edit opens the course form with the selected course', async () => {
    const user = userEvent.setup();
    const course = buildCourse();
    const { store } = renderCard('Admin', course);

    await user.click(getMenuButton());
    await user.click(await screen.findByText('Edit'));

    expect(store.getState().form.courses.mode).toBe('edit');
    expect(store.getState().form.courses.isAddCourseFormOpen).toBe(true);
    expect(store.getState().form.courses.selectedcourse).toBe(course);
  });

  it('deletes the course after confirmation', async () => {
    const user = userEvent.setup();
    renderCard('Admin');

    await user.click(getMenuButton());
    await user.click(await screen.findByText('Delete'));

    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }));

    expect(mocks.deleteCourse).toHaveBeenCalledWith({ courseId: 'course-1' });
  });

  it('lets a student enroll in a course', async () => {
    const user = userEvent.setup();
    renderCard('Student', buildCourse({ isEnrolled: false }));

    await user.click(screen.getByRole('button', { name: /enroll/i }));

    expect(mocks.enrollStudent).toHaveBeenCalledWith({
      input: { courseId: 'course-1' },
    });
    expect(mockedToast.success).toHaveBeenCalledWith(
      'student enrolled successfully'
    );
  });

  it('shows an enrolled chip instead of the enroll button', () => {
    renderCard('Student', buildCourse({ isEnrolled: true }));

    expect(screen.getByText('ENROLLED')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^enroll$/i })
    ).not.toBeInTheDocument();
  });

  it('manually enrolls a selected student', async () => {
    const user = userEvent.setup();
    mocks.students = [
      {
        userId: 'student-1',
        username: 'Sam Student',
        collegeName: 'Test College',
        profile_image_path: '/sam.png',
        isEnrolled: false,
      },
    ];
    renderCard('Admin');

    await user.click(screen.getByRole('button', { name: /manual enroll/i }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Sam Student')).toBeInTheDocument();

    await user.click(within(dialog).getByText('Sam Student'));
    await user.click(within(dialog).getByRole('button', { name: 'Enroll' }));

    expect(mocks.enrollStudent).toHaveBeenCalledWith({
      input: { userId: 'student-1', courseId: 'course-1' },
    });
    expect(mockedToast.success).toHaveBeenCalledWith(
      'student enrolled successfully'
    );
  });

  it('navigates to the course detail page', async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    store.dispatch(refreshUser(testUser as any));

    renderWithProviders(
      <Routes>
        <Route path="/" element={<CourseCard course={buildCourse()} />} />
        <Route
          path="/dashboard/course/:id"
          element={<div>Course detail</div>}
        />
      </Routes>,
      { store }
    );

    await user.click(
      screen.getByRole('button', { name: /visit this course/i })
    );

    expect(await screen.findByText('Course detail')).toBeInTheDocument();
  });
});
