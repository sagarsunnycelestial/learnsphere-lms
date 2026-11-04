import { describe, expect, it, beforeEach, vi } from 'vitest';
import themeReducer, { setTheme, toggleTheme } from './themeSlice';

describe('themeSlice', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('defaults to light when nothing is stored', () => {
    const state = themeReducer(undefined, { type: '@@INIT' });

    expect(state.theme).toBe('light');
  });

  it('sets the theme', () => {
    expect(themeReducer(undefined, setTheme('dark')).theme).toBe('dark');
  });

  it('toggles between light and dark', () => {
    const dark = themeReducer({ theme: 'light' }, toggleTheme());
    const light = themeReducer({ theme: 'dark' }, toggleTheme());

    expect(dark.theme).toBe('dark');
    expect(light.theme).toBe('light');
  });

  it('reads the stored theme on load', async () => {
    localStorage.setItem('theme', 'dark');

    const { default: freshReducer } = await import('./themeSlice');

    expect(freshReducer(undefined, { type: '@@INIT' }).theme).toBe('dark');
  });
});
