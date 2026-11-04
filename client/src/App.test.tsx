import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { createTestStore } from './test/render';

vi.mock('./router', () => ({ default: { routes: [] } }));
vi.mock('react-router', () => ({
  RouterProvider: () => <div>Router content</div>,
}));
vi.mock('react-toastify', () => ({
  ToastContainer: () => <div>Toasts</div>,
}));

describe('App', () => {
  it('renders the router and persists the selected theme', () => {
    const store = createTestStore({
      theme: { theme: 'dark' },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('Router content')).toBeInTheDocument();
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('persists a light theme', () => {
    const store = createTestStore({
      theme: { theme: 'light' },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(localStorage.getItem('theme')).toBe('light');
  });
});
