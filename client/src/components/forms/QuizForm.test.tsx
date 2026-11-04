/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuizForm from './QuizForm';
import { createTestStore, renderWithProviders } from '../../test/render';
import { quizFormControl } from '../../store/slices/formSlice';
import { toast } from 'react-toastify';

const mocks = vi.hoisted(() => ({
  addNewQuiz: vi.fn(),
}));

vi.mock('../../hooks/useQuizzesCRUD', () => ({
  default: () => ({ addNewQuiz: mocks.addNewQuiz }),
}));
vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useParams: () => ({ id: 'course-1' }) };
});

const mockedToast = vi.mocked(toast);

function renderAdd() {
  const store = createTestStore();
  const result = renderWithProviders(<QuizForm />, { store });
  return result;
}

function renderEdit() {
  const store = createTestStore();
  store.dispatch(
    quizFormControl({
      mode: 'edit',
      isQuizFormOpen: true,
      selectedQuiz: {
        quizId: 'quiz-1',
        quizName: 'Old Quiz',
        courseId: 'course-1',
      } as any,
    })
  );
  const result = renderWithProviders(<QuizForm />, { store });
  return result;
}

describe('QuizForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.addNewQuiz.mockResolvedValue({
      message: 'Quiz created successfully',
    });
  });

  it('renders the add quiz form', () => {
    renderAdd();

    expect(screen.getByText('Add A Quiz')).toBeInTheDocument();
    expect(screen.getByLabelText(/Quiz Name/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('validates the quiz name before submitting', async () => {
    const user = userEvent.setup();
    renderAdd();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(mocks.addNewQuiz).not.toHaveBeenCalled();
    expect(
      screen.getByText('Quiz name should have atleast 3 characters')
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Quiz Name/)).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('creates a quiz for the route course', async () => {
    const user = userEvent.setup();
    const { store } = renderAdd();

    await user.type(screen.getByLabelText(/Quiz Name/), 'New Quiz');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(mocks.addNewQuiz).toHaveBeenCalledWith({
        input: { quizName: 'New Quiz', courseId: 'course-1' },
      })
    );
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Quiz created successfully'
    );
    expect(store.getState().form.quizzes.isQuizFormOpen).toBe(false);
    expect(store.getState().form.quizzes.selectedQuiz).toBeNull();
  });

  it('reports quiz creation failures', async () => {
    const user = userEvent.setup();
    mocks.addNewQuiz.mockRejectedValue('boom');
    renderAdd();

    await user.type(screen.getByLabelText(/Quiz Name/), 'New Quiz');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(mockedToast.error).toHaveBeenCalledWith('boom'));
  });

  it('renders the edit form and does not submit', async () => {
    const user = userEvent.setup();
    const { store } = renderEdit();

    expect(screen.getByText('Edit Quiz')).toBeInTheDocument();
    expect(screen.getByLabelText(/Quiz Name/)).toHaveValue('Old Quiz');
    expect(
      screen.getByRole('button', { name: 'Confirm Edit' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Confirm Edit' }));

    expect(mocks.addNewQuiz).not.toHaveBeenCalled();
    expect(store.getState().form.quizzes.mode).toBe('edit');
  });

  it('closes the form', async () => {
    const user = userEvent.setup();
    const { store } = renderAdd();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(store.getState().form.quizzes.isQuizFormOpen).toBe(false);
    expect(store.getState().form.quizzes.selectedQuiz).toBeNull();
  });
});
