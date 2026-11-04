/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import ProfileMenu from './ProfileMenu';
import { createTestStore, renderWithProviders } from '../../test/render';
import { refreshUser } from '../../store/slices/authSlice';
import { testUser } from '../../test/fixtures';
import { toast } from 'react-toastify';

const mocks = vi.hoisted(() => ({
  signOut: vi.fn(),
  mutate: vi.fn(),
}));

vi.mock('../../firebase/firebase', () => ({
  auth: { name: 'test-auth' },
}));
vi.mock('firebase/auth', () => ({
  signOut: mocks.signOut,
}));
vi.mock('../../graphql/apolloClient', () => ({
  apolloClient: { mutate: mocks.mutate },
}));
vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

const mockedToast = vi.mocked(toast);

function renderMenu() {
  const store = createTestStore();
  store.dispatch(refreshUser(testUser as any));
  const result = renderWithProviders(
    <Routes>
      <Route path="/" element={<ProfileMenu profile_image="/avatar.png" />} />
      <Route path="/dashboard/profile" element={<div>Profile page</div>} />
      <Route path="/login" element={<div>Login page</div>} />
    </Routes>,
    { store }
  );
  return result;
}

async function openMenu(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByAltText('A'));
}

describe('ProfileMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.signOut.mockResolvedValue(undefined);
    mocks.mutate.mockResolvedValue({
      data: { logout: { message: 'Logged out successfully' } },
    });
  });

  it('shows the profile image', () => {
    renderMenu();

    expect(screen.getByAltText('A')).toHaveAttribute('src', '/avatar.png');
  });

  it('opens the menu and navigates to the profile page', async () => {
    const user = userEvent.setup();
    renderMenu();

    await openMenu(user);
    await user.click(screen.getByText('Profile'));

    expect(screen.getByText('Profile page')).toBeInTheDocument();
  });

  it('logs out, clears the session, and navigates to the login page', async () => {
    const user = userEvent.setup();
    const { store, queryClient } = renderMenu();
    const clearSpy = vi.spyOn(queryClient, 'clear');

    await openMenu(user);
    await user.click(screen.getByText('Logout'));

    expect(mocks.signOut).toHaveBeenCalledWith({ name: 'test-auth' });
    expect(mocks.mutate).toHaveBeenCalled();
    expect(mockedToast.success).toHaveBeenCalledWith('Logged out successfully');
    expect(store.getState().auth.user.accessToken).toBeNull();
    expect(clearSpy).toHaveBeenCalled();
    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });

  it('does not show a toast when the server returns no message', async () => {
    const user = userEvent.setup();
    mocks.mutate.mockResolvedValue({ data: {} });
    renderMenu();

    await openMenu(user);
    await user.click(screen.getByText('Logout'));

    expect(mockedToast.success).not.toHaveBeenCalled();
    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });
});
