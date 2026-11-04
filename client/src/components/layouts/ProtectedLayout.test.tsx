/* eslint-disable */
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import ProtectedLayout from './ProtectedLayout';
import { createTestStore, renderWithProviders } from '../../test/render';
import { refreshUser } from '../../store/slices/authSlice';
import { testUser } from '../../test/fixtures';

vi.mock('./SideBar', () => ({
  default: ({ children }: any) => (
    <div>
      Sidebar
      {children}
    </div>
  ),
}));

function renderLayout(authenticated: boolean) {
  const store = createTestStore();
  if (authenticated) {
    store.dispatch(refreshUser(testUser as any));
  }
  renderWithProviders(
    <Routes>
      <Route path="/" element={<div>Home page</div>} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<div>Dashboard content</div>} />
      </Route>
    </Routes>,
    { route: '/dashboard', store }
  );
  return store;
}

describe('ProtectedLayout', () => {
  it('renders the sidebar and outlet for authenticated users', () => {
    renderLayout(true);

    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to the home page', () => {
    renderLayout(false);

    expect(screen.getByText('Home page')).toBeInTheDocument();
    expect(screen.queryByText('Sidebar')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard content')).not.toBeInTheDocument();
  });
});
