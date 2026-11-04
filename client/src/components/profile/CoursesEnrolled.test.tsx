/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import CoursesEnrolled from './CoursesEnrolled';
import { createTestStore, renderWithProviders } from '../../test/render';
import useFetchProfile from '../../hooks/useFetchProfile';

vi.mock('../../hooks/useFetchProfile', () => ({ default: vi.fn() }));

const mockedUseFetchProfile = vi.mocked(useFetchProfile);

function renderEnrollments(data: any) {
  mockedUseFetchProfile.mockReturnValue({ data } as any);
  renderWithProviders(<CoursesEnrolled />, { store: createTestStore() });
}

describe('CoursesEnrolled', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows an empty state when no courses were enrolled', () => {
    renderEnrollments({ enrollments: [] });

    expect(screen.getByText('No courses enrolled yet')).toBeInTheDocument();
  });

  it('renders the enrollment rows with dates and status', () => {
    const enrolledAt = 1700000000000;
    renderEnrollments({
      enrollments: [
        {
          enrollmentId: 'enrollment-1',
          enrolledAt,
          isActive: true,
          course: { courseName: 'Active Course' },
        },
        {
          enrollmentId: 'enrollment-2',
          enrolledAt,
          isActive: false,
          course: { courseName: 'Inactive Course' },
        },
      ],
    });

    const formattedDate = new Date(Number(enrolledAt)).toLocaleDateString(
      'en-IN',
      { day: '2-digit', month: 'short', year: 'numeric' }
    );

    expect(screen.getByText('Active Course')).toBeInTheDocument();
    expect(screen.getByText('Inactive Course')).toBeInTheDocument();
    expect(screen.getAllByText(formattedDate)).toHaveLength(2);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });
});
