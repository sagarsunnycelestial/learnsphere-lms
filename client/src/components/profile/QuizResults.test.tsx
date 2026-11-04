/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import QuizResults from './QuizResults';
import { createTestStore, renderWithProviders } from '../../test/render';
import useFetchProfile from '../../hooks/useFetchProfile';

vi.mock('../../hooks/useFetchProfile', () => ({ default: vi.fn() }));

const mockedUseFetchProfile = vi.mocked(useFetchProfile);

function renderResults(data: any) {
  mockedUseFetchProfile.mockReturnValue({ data } as any);
  renderWithProviders(<QuizResults />, { store: createTestStore() });
}

describe('QuizResults', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows an empty state when there are no results', () => {
    renderResults({ results: [] });

    expect(screen.getByText('No results yet')).toBeInTheDocument();
  });

  it('renders the quiz names and scores', () => {
    renderResults({
      results: [
        {
          resultId: 'result-1',
          score: 80,
          quiz: { quizName: 'Quiz One' },
        },
        {
          resultId: 'result-2',
          score: 40,
          quiz: { quizName: 'Quiz Two' },
        },
      ],
    });

    expect(screen.getByText('Quiz One')).toBeInTheDocument();
    expect(screen.getByText('Quiz Two')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('falls back to a dash for a missing score', () => {
    renderResults({
      results: [
        {
          resultId: 'result-1',
          score: null,
          quiz: { quizName: 'Quiz One' },
        },
      ],
    });

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
