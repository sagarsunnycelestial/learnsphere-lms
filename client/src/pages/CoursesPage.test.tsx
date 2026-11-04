/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CoursesPage from './CoursesPage';
import { createTestStore, renderWithProviders } from '../test/render';
import useFetchCourses from '../hooks/useFetchCourses';
import { testCourse } from '../test/fixtures';
import { addCourseFormControl } from '../store/slices/formSlice';

vi.mock('../hooks/useFetchCourses', () => ({ default: vi.fn() }));
vi.mock('../components/forms/CourseForm', () => ({
  default: () => <div>Course form</div>,
}));
vi.mock('../components/dashboard/CourseCard', () => ({
  default: ({ course }: any) => <div>{course.courseName}</div>,
}));

const mockedUseFetchCourses = vi.mocked(useFetchCourses);

function mockCourses(data: any[] | undefined, isLoading = false) {
  mockedUseFetchCourses.mockReturnValue({ data, isLoading } as any);
}

describe('CoursesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a progress indicator while loading', () => {
    mockCourses(undefined, true);

    renderWithProviders(<CoursesPage />, { store: createTestStore() });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows an empty state when there are no courses', () => {
    mockCourses([]);

    renderWithProviders(<CoursesPage />, { store: createTestStore() });

    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('renders the fetched courses', () => {
    mockCourses([testCourse]);

    renderWithProviders(<CoursesPage />, { store: createTestStore() });

    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(mockedUseFetchCourses).toHaveBeenCalledWith({
      filter: { status: undefined },
    });
  });

  it('filters courses by search text after debouncing', async () => {
    mockCourses([
      { ...testCourse, courseId: 'a', courseName: 'Alpha Course' },
      { ...testCourse, courseId: 'b', courseName: 'Beta Course' },
    ]);
    const user = userEvent.setup();

    renderWithProviders(<CoursesPage />, { store: createTestStore() });

    await user.type(screen.getByPlaceholderText('Search courses...'), 'alpha');

    await waitFor(
      () => expect(screen.queryByText('Beta Course')).not.toBeInTheDocument(),
      { timeout: 2000 }
    );
    expect(screen.getByText('Alpha Course')).toBeInTheDocument();
  });

  it('requests the active filter when the toggle changes', async () => {
    mockCourses([testCourse]);
    const user = userEvent.setup();

    renderWithProviders(<CoursesPage />, { store: createTestStore() });

    await user.click(screen.getByRole('button', { name: 'Active' }));

    expect(mockedUseFetchCourses).toHaveBeenLastCalledWith({
      filter: { status: 'active' },
    });
  });

  it('opens the course dialog from the form state', () => {
    mockCourses([testCourse]);
    const store = createTestStore();
    store.dispatch(
      addCourseFormControl({
        mode: 'add',
        isAddCourseFormOpen: true,
        selectedcourse: null,
      })
    );

    renderWithProviders(<CoursesPage />, { store });

    expect(screen.getByText('Course form')).toBeInTheDocument();
  });
});
