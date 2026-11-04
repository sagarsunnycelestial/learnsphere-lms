/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import HomePage from './HomePage';
import { createTestStore, renderWithProviders } from '../test/render';
import { apolloClient } from '../graphql/apolloClient';

vi.mock('../graphql/apolloClient', () => ({
  apolloClient: { query: vi.fn() },
}));

const mockedQuery = vi.mocked(apolloClient.query);

function renderHome() {
  const store = createTestStore();
  renderWithProviders(
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<div>Dashboard page</div>} />
      <Route path="/auth/login" element={<div>Login page</div>} />
    </Routes>,
    { store }
  );
  return store;
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a progress indicator while refreshing the session', () => {
    mockedQuery.mockReturnValue(new Promise(() => {}) as any);

    renderHome();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('stores the refreshed session and navigates to the dashboard', async () => {
    mockedQuery.mockResolvedValue({
      data: {
        refreshEndpoint: {
          accessToken: 'new-token',
          role: 'Instructor',
          profile_image_path: '/avatar.png',
        },
      },
    } as any);
    const store = renderHome();

    expect(await screen.findByText('Dashboard page')).toBeInTheDocument();
    expect(store.getState().auth.user.accessToken).toBe('new-token');
    expect(store.getState().auth.user.role).toBe('Instructor');
  });

  it('falls back to the welcome card when no session is returned', async () => {
    mockedQuery.mockResolvedValue({ data: {} } as any);

    renderHome();

    expect(
      await screen.findByText('Welcome to LearnSphere')
    ).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('falls back to the welcome card when the refresh fails', async () => {
    mockedQuery.mockRejectedValue(new Error('network'));

    renderHome();

    expect(
      await screen.findByText('Welcome to LearnSphere')
    ).toBeInTheDocument();
  });

  it('navigates to the login page from the welcome card', async () => {
    mockedQuery.mockRejectedValue(new Error('network'));
    const user = userEvent.setup();

    renderHome();

    await user.click(
      await screen.findByRole('button', { name: 'Go to Login' })
    );

    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });
});
