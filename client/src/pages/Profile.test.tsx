/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profile from './Profile';
import { createTestStore, renderWithProviders } from '../test/render';
import useFetchProfile from '../hooks/useFetchProfile';

vi.mock('../hooks/useFetchProfile', () => ({ default: vi.fn() }));
vi.mock('../components/profile/ProfileBar', () => ({
  default: () => <div>Profile bar</div>,
}));
vi.mock('../components/forms/AddUserForm', () => ({
  default: () => <div>Add user form</div>,
}));

const mockedUseFetchProfile = vi.mocked(useFetchProfile);

const profile = {
  userId: 'user-1',
  username: 'jane',
  email: 'jane@test.com',
  collegeName: 'Test College',
  profile_image_path: '/avatar.png',
  role: { roleName: 'Instructor' },
  enrollments: [{ enrollmentId: 'e1' }],
  courses: [],
  results: [],
};

describe('Profile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a progress indicator while loading', () => {
    mockedUseFetchProfile.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    renderWithProviders(<Profile />, { store: createTestStore() });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders the profile details and the profile bar', () => {
    mockedUseFetchProfile.mockReturnValue({
      data: profile,
      isLoading: false,
    } as any);

    renderWithProviders(<Profile />, { store: createTestStore() });

    expect(screen.getByText('jane')).toBeInTheDocument();
    expect(screen.getByText('jane@test.com')).toBeInTheDocument();
    expect(screen.getByText('Test College')).toBeInTheDocument();
    expect(screen.getByText('Profile bar')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('opens the edit dialog and seeds the selected user', async () => {
    mockedUseFetchProfile.mockReturnValue({
      data: profile,
      isLoading: false,
    } as any);
    const store = createTestStore();
    const user = userEvent.setup();

    renderWithProviders(<Profile />, { store });

    expect(screen.queryByText('Add user form')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /edit profile/i }));

    expect(store.getState().form.users.mode).toBe('edit');
    expect(store.getState().form.users.isUserAddFormOpen).toBe(true);
    expect(store.getState().form.users.selectedUser).toEqual({
      userName: 'jane',
      email: 'jane@test.com',
      collegeName: 'Test College',
    });
    expect(screen.getByText('Add user form')).toBeInTheDocument();
  });
});
