import { describe, expect, it, vi, beforeEach } from 'vitest';
import authReducer, { logout, refreshUser } from './authSlice';
import { loginThunk } from '../thunks/loginThunk';
import { googleLoginThunk } from '../thunks/googleLoginThunk';

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

const authenticatedState = {
  status: 'succeeded' as const,
  user: {
    accessToken: 'token',
    role: 'Admin' as const,
    isAuthenticated: true,
    profile_image_path: '/avatar.png',
  },
  error: null,
};

describe('authSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts logged out as a student', () => {
    const state = authReducer(undefined, { type: '@@INIT' });

    expect(state.user.isAuthenticated).toBe(false);
    expect(state.user.accessToken).toBeNull();
    expect(state.user.role).toBe('Student');
  });

  it('clears the user on logout', () => {
    const state = authReducer(authenticatedState, logout());

    expect(state.user).toEqual({
      accessToken: null,
      role: 'Student',
      isAuthenticated: false,
      profile_image_path: null,
    });
  });

  it('restores the user on refreshUser', () => {
    const refreshed = {
      accessToken: 'new-token',
      role: 'Instructor',
      isAuthenticated: true,
      profile_image_path: '/new.png',
    };

    const state = authReducer(undefined, refreshUser(refreshed));

    expect(state.user).toEqual(refreshed);
    expect(state.status).toBe('succeeded');
  });

  it('marks login as loading', () => {
    const state = authReducer(
      undefined,
      loginThunk.pending('request-1', {
        email: 'admin@test.com',
        password: 'secret',
      })
    );

    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('stores the user when login succeeds', () => {
    const state = authReducer(
      undefined,
      loginThunk.fulfilled(
        {
          accessToken: 'token',
          role: 'Admin',
          profile_image_path: '/avatar.png',
        },
        'request-1',
        { email: 'admin@test.com', password: 'secret' }
      )
    );

    expect(state.status).toBe('succeeded');
    expect(state.user.isAuthenticated).toBe(true);
    expect(state.user.role).toBe('Admin');
  });

  it('stores the error when login fails', async () => {
    const { toast } = await import('react-toastify');
    const state = authReducer(
      undefined,
      loginThunk.rejected(
        new Error('failed'),
        'request-1',
        { email: 'admin@test.com', password: 'secret' },
        { message: 'Invalid credentials' }
      )
    );

    expect(state.error).toEqual({ message: 'Invalid credentials' });
    expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
  });

  it('stores the user when google login succeeds', () => {
    const state = authReducer(
      undefined,
      googleLoginThunk.fulfilled(
        {
          accessToken: 'google-token',
          role: 'Student',
          profile_image_path: null,
        },
        'request-1',
        { input: { idToken: 'id-token' } }
      )
    );

    expect(state.user.accessToken).toBe('google-token');
    expect(state.user.isAuthenticated).toBe(true);
  });

  it('handles google login errors', async () => {
    const { toast } = await import('react-toastify');
    const state = authReducer(
      undefined,
      googleLoginThunk.rejected(
        new Error('failed'),
        'request-1',
        { input: { idToken: 'id-token' } },
        { message: 'Google failed' }
      )
    );

    expect(state.error).toEqual({ message: 'Google failed' });
    expect(toast.error).toHaveBeenCalledWith('Google failed');
  });
});
