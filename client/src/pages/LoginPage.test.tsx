/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import LoginPage from './LoginPage';
import { createTestStore, renderWithProviders } from '../test/render';
import { loginThunk } from '../store/thunks/loginThunk';
import { googleLoginThunk } from '../store/thunks/googleLoginThunk';
import { signInWithPopup } from 'firebase/auth';
import { toast } from 'react-toastify';

const mocks = vi.hoisted(() => ({
  loginUnwrap: vi.fn(),
  googleUnwrap: vi.fn(),
  signInWithPopup: vi.fn(),
}));

vi.mock('../store/thunks/loginThunk', () => ({
  loginThunk: Object.assign(
    vi.fn(() => () => ({ unwrap: mocks.loginUnwrap })),
    {
      pending: 'login/pending',
      fulfilled: 'login/fulfilled',
      rejected: 'login/rejected',
    }
  ),
}));
vi.mock('../store/thunks/googleLoginThunk', () => ({
  googleLoginThunk: Object.assign(
    vi.fn(() => () => ({ unwrap: mocks.googleUnwrap })),
    {
      pending: 'googleLogin/pending',
      fulfilled: 'googleLogin/fulfilled',
      rejected: 'googleLogin/rejected',
    }
  ),
}));
vi.mock('../firebase/firebase', () => ({
  auth: { name: 'test-auth' },
  provider: { name: 'test-provider' },
}));
vi.mock('firebase/auth', () => ({
  signInWithPopup: mocks.signInWithPopup,
}));
vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

const mockedLoginThunk = vi.mocked(loginThunk);
const mockedGoogleThunk = vi.mocked(googleLoginThunk);
const mockedSignIn = vi.mocked(signInWithPopup);
const mockedToast = vi.mocked(toast);

function renderLogin() {
  renderWithProviders(
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<div>Dashboard page</div>} />
    </Routes>,
    { store: createTestStore() }
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.loginUnwrap.mockResolvedValue(undefined);
    mocks.googleUnwrap.mockResolvedValue(undefined);
  });

  it('requires both credentials', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(mockedToast.error).toHaveBeenCalledWith(
      'Please enter both email and password'
    );
    expect(mockedLoginThunk).not.toHaveBeenCalled();
  });

  it('rejects an invalid email', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(mockedToast.error).toHaveBeenCalledWith(
      'Pleaser enter a valid email'
    );
    expect(mockedLoginThunk).not.toHaveBeenCalled();
  });

  it('logs in and redirects to the dashboard', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('Email'), 'admin@test.com');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(mockedLoginThunk).toHaveBeenCalledWith({
      email: 'admin@test.com',
      password: 'secret',
    });
    expect(await screen.findByText('Dashboard page')).toBeInTheDocument();
  });

  it('reports login failures', async () => {
    const user = userEvent.setup();
    mocks.loginUnwrap.mockRejectedValue(new Error('Invalid credentials'));
    renderLogin();

    await user.type(screen.getByLabelText('Email'), 'admin@test.com');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() =>
      expect(mockedToast.error).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Invalid credentials' })
      )
    );
    expect(screen.queryByText('Dashboard page')).not.toBeInTheDocument();
  });

  it('logs in with Google and redirects', async () => {
    const user = userEvent.setup();
    mockedSignIn.mockResolvedValue({
      user: { getIdToken: async () => 'id-token' },
    } as any);
    renderLogin();

    await user.click(
      screen.getByRole('button', { name: /sign in with google/i })
    );

    await waitFor(() =>
      expect(mockedGoogleThunk).toHaveBeenCalledWith({
        input: { idToken: 'id-token' },
      })
    );
    expect(await screen.findByText('Dashboard page')).toBeInTheDocument();
  });

  it('reports Google login failures', async () => {
    const user = userEvent.setup();
    mockedSignIn.mockRejectedValue(new Error('Popup blocked'));
    renderLogin();

    await user.click(
      screen.getByRole('button', { name: /sign in with google/i })
    );

    await waitFor(() =>
      expect(mockedToast.error).toHaveBeenCalledWith('Popup blocked')
    );
  });
});
