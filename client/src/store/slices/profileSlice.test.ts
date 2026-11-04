import { describe, expect, it } from 'vitest';
import profileReducer, {
  changePage,
  changeTab,
  changeView,
  countEmps,
  searchQ,
} from './profileSlice';

describe('profileSlice', () => {
  it('starts with card view and the first tab', () => {
    const state = profileReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      viewType: 'card',
      searchQuery: '',
      currentTab: '1',
      page: 1,
      totalEnrolled: 0,
    });
  });

  it('changes the view type', () => {
    expect(profileReducer(undefined, changeView('list')).viewType).toBe('list');
  });

  it('changes the search query', () => {
    expect(profileReducer(undefined, searchQ('testing')).searchQuery).toBe(
      'testing'
    );
  });

  it('changes the active tab', () => {
    expect(profileReducer(undefined, changeTab('2')).currentTab).toBe('2');
  });

  it('changes the page', () => {
    expect(profileReducer(undefined, changePage(3)).page).toBe(3);
  });

  it('stores the enrollment count', () => {
    expect(profileReducer(undefined, countEmps(42)).totalEnrolled).toBe(42);
  });
});
