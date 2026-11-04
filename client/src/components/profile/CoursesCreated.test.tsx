/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import CoursesCreated from './CoursesCreated';
import { createTestStore, renderWithProviders } from '../../test/render';
import useFetchProfile from '../../hooks/useFetchProfile';

vi.mock('../../hooks/useFetchProfile', () => ({ default: vi.fn() }));

const mockedUseFetchProfile = vi.mocked(useFetchProfile);

function renderCourses(data: any) {
  mockedUseFetchProfile.mockReturnValue({ data } as any);
  renderWithProviders(<CoursesCreated />, { store: createTestStore() });
}

describe('CoursesCreated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows an empty state when no courses were created', () => {
    renderCourses({ courses: [] });

    expect(screen.getByText('No courses created yet')).toBeInTheDocument();
  });

  it('renders the course rows with their status', () => {
    renderCourses({
      courses: [
        { courseId: 'course-1', courseName: 'Active Course', isActive: true },
        {
          courseId: 'course-2',
          courseName: 'Archived Course',
          isActive: false,
        },
      ],
    });

    expect(screen.getByText('Active Course')).toBeInTheDocument();
    expect(screen.getByText('Archived Course')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Archived')).toBeInTheDocument();
  });
});
