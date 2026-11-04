import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import SideBar from './SideBar';
import { createTestStore, renderWithProviders } from '../../test/render';

vi.mock('../profile/ProfileMenu', () => ({
  default: () => <div>Profile menu</div>,
}));

function renderSideBar() {
  const store = createTestStore();
  renderWithProviders(
    <Routes>
      <Route
        path="/"
        element={
          <SideBar>
            <div>Child content</div>
          </SideBar>
        }
      />
      <Route
        path="/dashboard"
        element={<SideBar>{<div>Dashboard page</div>}</SideBar>}
      />
      <Route
        path="/dashboard/profile"
        element={<SideBar>{<div>Profile page</div>}</SideBar>}
      />
    </Routes>,
    { store }
  );
  return store;
}

describe('SideBar', () => {
  it('renders the app bar and its children', () => {
    renderSideBar();

    expect(screen.getByAltText('LearnSphere logo')).toBeInTheDocument();
    expect(screen.getByText('LearnSphere')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
    expect(screen.getByText('Profile menu')).toBeInTheDocument();
    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
  });

  it('opens and closes the drawer', async () => {
    const user = userEvent.setup();
    renderSideBar();

    await user.click(screen.getByRole('button', { name: 'open drawer' }));

    expect(screen.getByText('Menu')).toBeInTheDocument();

    await user.click(
      screen.getByTestId('ChevronLeftIcon').closest('button') as HTMLElement
    );

    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
  });

  it('navigates to the dashboard and profile pages', async () => {
    const user = userEvent.setup();
    renderSideBar();

    await user.click(screen.getByText('Courses'));

    expect(screen.getByText('Dashboard page')).toBeInTheDocument();

    await user.click(screen.getByText('Profile'));

    expect(screen.getByText('Profile page')).toBeInTheDocument();
  });

  it('toggles the theme', async () => {
    const user = userEvent.setup();
    const store = renderSideBar();
    const initialTheme = store.getState().theme.theme;

    await user.click(screen.getByRole('switch'));

    expect(store.getState().theme.theme).not.toBe(initialTheme);
  });
});
