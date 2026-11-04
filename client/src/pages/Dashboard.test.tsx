/* eslint-disable */
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { createTestStore, renderWithProviders } from '../test/render';
import { studentUser, testUser } from '../test/fixtures';
import { refreshUser } from '../store/slices/authSlice';

vi.mock('../components/dashboard/ActionTab', () => ({
  default: () => <div>Action tab</div>,
}));
vi.mock('./CoursesPage', () => ({
  default: () => <div>Courses page</div>,
}));

function renderDashboard(role: string) {
  const store = createTestStore();
  store.dispatch(refreshUser({ ...testUser, role } as any));
  renderWithProviders(<Dashboard />, { store });
  return store;
}

describe('Dashboard', () => {
  it('shows the action tab and course list for admins', () => {
    renderDashboard('Admin');

    expect(screen.getByText('Action tab')).toBeInTheDocument();
    expect(screen.getByText('Courses page')).toBeInTheDocument();
  });

  it('shows the action tab for instructors', () => {
    renderDashboard('Instructor');

    expect(screen.getByText('Action tab')).toBeInTheDocument();
  });

  it('hides the action tab from students', () => {
    const store = createTestStore();
    store.dispatch(refreshUser(studentUser as any));

    renderWithProviders(<Dashboard />, { store });

    expect(screen.queryByText('Action tab')).not.toBeInTheDocument();
    expect(screen.getByText('Courses page')).toBeInTheDocument();
  });
});
