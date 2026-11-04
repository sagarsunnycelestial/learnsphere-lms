/* eslint-disable */
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionTab from './ActionTab';
import { createTestStore, renderWithProviders } from '../../test/render';
import { refreshUser } from '../../store/slices/authSlice';
import { studentUser, testUser } from '../../test/fixtures';

vi.mock('../forms/AddUserForm', () => ({
  default: () => <div>Add user form</div>,
}));

function renderTab(role: string) {
  const store = createTestStore();
  store.dispatch(
    refreshUser({
      ...(role === 'Student' ? studentUser : testUser),
      role,
    } as any)
  );
  renderWithProviders(<ActionTab />, { store });
  return store;
}

describe('ActionTab', () => {
  it('shows both actions to admins', () => {
    renderTab('Admin');

    expect(screen.getByText('Admin Controls')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add user/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add course/i })
    ).toBeInTheDocument();
  });

  it('hides user creation from instructors', () => {
    renderTab('Instructor');

    expect(screen.getByText('Instructor Controls')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /add user/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add course/i })
    ).toBeInTheDocument();
  });

  it('opens the add user dialog', async () => {
    const user = userEvent.setup();
    const store = renderTab('Admin');

    expect(screen.queryByText('Add user form')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add user/i }));

    expect(store.getState().form.users.mode).toBe('add');
    expect(store.getState().form.users.isUserAddFormOpen).toBe(true);
    expect(screen.getByText('Add user form')).toBeInTheDocument();
  });

  it('opens the course form', async () => {
    const user = userEvent.setup();
    const store = renderTab('Admin');

    await user.click(screen.getByRole('button', { name: /add course/i }));

    expect(store.getState().form.courses.mode).toBe('add');
    expect(store.getState().form.courses.isAddCourseFormOpen).toBe(true);
  });

  it('does not render actions for students', () => {
    renderTab('Student');

    expect(
      screen.queryByRole('button', { name: /add user/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /add course/i })
    ).not.toBeInTheDocument();
  });
});
