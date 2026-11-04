import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuestionForm from './QuestionForm';
import { createTestStore, renderWithProviders } from '../../test/render';
import { questionFormControl } from '../../store/slices/formSlice';
import { toast } from 'react-toastify';

const mocks = vi.hoisted(() => ({
  createAQuestion: vi.fn(),
}));

vi.mock('../../hooks/useQuizzesCRUD', () => ({
  default: () => ({ createAQuestion: mocks.createAQuestion }),
}));
vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

const mockedToast = vi.mocked(toast);

function renderForm() {
  const store = createTestStore();
  store.dispatch(
    questionFormControl({
      mode: 'add',
      isQuestionFormOpen: true,
      quizId: 'quiz-1',
    })
  );
  const result = renderWithProviders(<QuestionForm />, { store });
  return result;
}

async function fillQuestion(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Question Text/), 'What is 2+2?');
  await user.type(screen.getByLabelText(/Correct Option/), 'Four');
  await user.type(screen.getByLabelText(/Enter option 2/), 'Three');
}

describe('QuestionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createAQuestion.mockResolvedValue({
      message: 'Question created successfully',
    });
  });

  it('renders the question form', () => {
    renderForm();

    expect(screen.getByText('Add A Question')).toBeInTheDocument();
    expect(screen.getByLabelText(/Question Text/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Enter option 2/)).toBeInTheDocument();
  });

  it('adds up to the maximum number of options', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /add option/i }));
    await user.click(screen.getByRole('button', { name: /add option/i }));

    expect(screen.getByLabelText(/Enter option 3/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Enter option 4/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add option/i }));

    expect(mockedToast.info).toHaveBeenCalledWith(
      'You can only have 4 options.'
    );
  });

  it('validates before submitting', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(mocks.createAQuestion).not.toHaveBeenCalled();
    expect(
      screen.getByText('Question should have atleast 3 characters')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Option should have atleast 3 characters')
    ).toBeInTheDocument();
  });

  it('creates a question with the filled options', async () => {
    const user = userEvent.setup();
    const { store } = renderForm();

    await fillQuestion(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(mocks.createAQuestion).toHaveBeenCalledWith({
        input: {
          quizId: 'quiz-1',
          questionText: 'What is 2+2?',
          correctOption: 'Four',
          options: ['Three'],
        },
      })
    );
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Question created successfully'
    );
    expect(store.getState().form.questions.isQuestionFormOpen).toBe(false);
  });

  it('reports creation failures', async () => {
    const user = userEvent.setup();
    mocks.createAQuestion.mockRejectedValue('boom');
    renderForm();

    await fillQuestion(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(mockedToast.error).toHaveBeenCalledWith('boom'));
  });
});
