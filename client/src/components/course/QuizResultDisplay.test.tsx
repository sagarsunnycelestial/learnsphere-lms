/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuizResultDisplay from './QuizResultDisplay';
import { createTestStore, renderWithProviders } from '../../test/render';
import { testQuizResult } from '../../test/fixtures';
import { downloadResultPDF } from '../../pdf-lib/pdfHandler';

vi.mock('../../pdf-lib/pdfHandler', () => ({
  downloadResultPDF: vi.fn(),
}));

const mockedDownload = vi.mocked(downloadResultPDF);

function renderResult(quizResult: any) {
  const store = createTestStore();
  store.dispatch({
    type: 'form/resultDisplay',
    payload: { submitted: Boolean(quizResult), quizResult },
  });
  renderWithProviders(<QuizResultDisplay />, { store });
  return store;
}

describe('QuizResultDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedDownload.mockResolvedValue(undefined as never);
  });

  it('shows an empty message without a result', () => {
    renderResult(null);

    expect(screen.getByText('No quiz result to show yet.')).toBeInTheDocument();
  });

  it('renders the quiz result details', () => {
    renderResult(testQuizResult);

    expect(screen.getByText('student')).toBeInTheDocument();
    expect(screen.getAllByText('Test Course').length).toBeGreaterThan(0);
    expect(screen.getByText('Test Quiz')).toBeInTheDocument();
    expect(screen.getByText('Score: 80 %')).toBeInTheDocument();
    expect(screen.getByText('Course Active')).toBeInTheDocument();
  });

  it('uses fallbacks for missing fields', () => {
    renderResult({
      ...testQuizResult,
      username: null,
      courseDetail: null,
      quizName: null,
      score: null,
    });

    expect(screen.getByText('Unknown user')).toBeInTheDocument();
    expect(screen.getByText('Unknown course')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Score: 0 %')).toBeInTheDocument();
  });

  it('closes the result display', async () => {
    const user = userEvent.setup();
    const store = renderResult(testQuizResult);

    await user.click(screen.getByRole('button', { name: 'close' }));

    expect(store.getState().form.results.submitted).toBe(false);
    expect(store.getState().form.results.quizResult).toBeNull();
    expect(screen.getByText('No quiz result to show yet.')).toBeInTheDocument();
  });

  it('downloads the result as a PDF', async () => {
    const user = userEvent.setup();
    renderResult(testQuizResult);

    await user.click(screen.getByRole('button', { name: /download result/i }));

    expect(mockedDownload).toHaveBeenCalledWith(testQuizResult);
  });
});
