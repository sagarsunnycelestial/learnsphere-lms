/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileBar from './ProfileBar';
import { createTestStore, renderWithProviders } from '../../test/render';
import { refreshUser } from '../../store/slices/authSlice';
import { studentUser, testUser } from '../../test/fixtures';

vi.mock('./CoursesCreated', () => ({
  default: () => <div>Courses created table</div>,
}));
vi.mock('./CoursesEnrolled', () => ({
  default: () => <div>Courses enrolled table</div>,
}));
vi.mock('./QuizResults', () => ({
  default: () => <div>Quiz results table</div>,
}));

function renderBar(role: string) {
  const store = createTestStore();
  store.dispatch(
    refreshUser({
      ...(role === 'Student' ? studentUser : testUser),
      role,
    } as any)
  );
  renderWithProviders(<ProfileBar />, { store });
  return store;
}

describe('ProfileBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows enrolled courses and quiz results to students', () => {
    renderBar('Student');

    expect(screen.getByText('Courses Enrolled')).toBeInTheDocument();
    expect(screen.getByText('Quiz Results')).toBeInTheDocument();
    expect(screen.getByText('Courses enrolled table')).toBeInTheDocument();
    expect(screen.queryByText('Courses created table')).not.toBeInTheDocument();
  });

  it('switches to the quiz results tab for students', async () => {
    const user = userEvent.setup();
    const store = renderBar('Student');

    await user.click(screen.getByText('Quiz Results'));

    expect(store.getState().profile.currentTab).toBe('2');
    expect(screen.getByText('Quiz results table')).toBeInTheDocument();
  });

  it('shows created courses to instructors', () => {
    renderBar('Instructor');

    expect(screen.getByText('Courses Created By')).toBeInTheDocument();
    expect(screen.getByText('Courses created table')).toBeInTheDocument();
    expect(screen.queryByText('Quiz Results')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Courses enrolled table')
    ).not.toBeInTheDocument();
  });

  it('shows created courses to admins', () => {
    renderBar('Admin');

    expect(screen.getByText('Courses Created By')).toBeInTheDocument();
    expect(screen.getByText('Courses created table')).toBeInTheDocument();
  });
});
