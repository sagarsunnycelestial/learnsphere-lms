/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import useQuizzesRUD from './useQuizzesCRUD';
import { apolloClient } from '../graphql/apolloClient';
import { createTestQueryClient } from '../test/render';
import { toast } from 'react-toastify';

vi.mock('../graphql/apolloClient', () => ({
  apolloClient: { mutate: vi.fn() },
}));
vi.mock('react-router', () => ({
  useParams: () => ({ id: 'course-1' }),
}));
vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

const mockedMutate = vi.mocked(apolloClient.mutate);

function buildWrapper() {
  const client = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}

describe('useQuizzesRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds a quiz and invalidates the course', async () => {
    const { client, wrapper } = buildWrapper();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    mockedMutate.mockResolvedValue({
      data: { createAQuiz: { message: 'quiz created' } },
    } as any);
    const { result } = renderHook(() => useQuizzesRUD(), { wrapper });

    let response: any;
    await act(async () => {
      response = await result.current.addNewQuiz({
        input: { courseId: 'course-1', quizName: 'Quiz' },
      } as any);
    });

    expect(response).toEqual({ message: 'quiz created' });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['course', 'course-1'],
    });
  });

  it('throws when adding a quiz returns no data', async () => {
    const { wrapper } = buildWrapper();
    mockedMutate.mockResolvedValue({ data: null } as any);
    const { result } = renderHook(() => useQuizzesRUD(), { wrapper });

    await act(async () => {
      await expect(
        result.current.addNewQuiz({ input: {} } as any)
      ).rejects.toThrow('No response from server');
    });

    expect(toast.error).toHaveBeenCalledWith('Creating a quiz failed');
  });

  it('creates questions, submits answers and deletes', async () => {
    const { wrapper } = buildWrapper();
    const { result } = renderHook(() => useQuizzesRUD(), { wrapper });

    mockedMutate.mockResolvedValue({
      data: { createAQuestion: { message: 'created' } },
    } as any);
    await act(async () => {
      await result.current.createAQuestion({ input: {} } as any);
    });

    mockedMutate.mockResolvedValue({
      data: { submitQuiz: { score: 100 } },
    } as any);
    let submission: any;
    await act(async () => {
      submission = await result.current.submitQuizAnswers({ input: {} } as any);
    });
    expect(submission).toEqual({ score: 100 });

    mockedMutate.mockResolvedValue({
      data: { deleteQuiz: { message: 'deleted' } },
    } as any);
    await act(async () => {
      await result.current.deleteQuiz({ quizId: 'quiz-1' } as any);
    });

    mockedMutate.mockResolvedValue({
      data: { deleteQuestion: { message: 'deleted' } },
    } as any);
    await act(async () => {
      await result.current.deleteQuestion({
        quizId: 'quiz-1',
        questionId: 'question-1',
      } as any);
    });

    expect(mockedMutate).toHaveBeenCalledTimes(4);
  });

  it('reports failures for each mutation', async () => {
    const { wrapper } = buildWrapper();
    mockedMutate.mockRejectedValue(new Error('failed'));
    const { result } = renderHook(() => useQuizzesRUD(), { wrapper });

    const calls = [
      () => result.current.createAQuestion({ input: {} } as any),
      () => result.current.submitQuizAnswers({ input: {} } as any),
      () => result.current.deleteQuiz({ quizId: 'quiz-1' } as any),
      () =>
        result.current.deleteQuestion({
          quizId: 'quiz-1',
          questionId: 'question-1',
        } as any),
    ];

    for (const call of calls) {
      await act(async () => {
        await expect(call()).rejects.toThrow('failed');
      });
    }

    expect(toast.error).toHaveBeenCalledWith('Adding question failed');
    expect(toast.error).toHaveBeenCalledWith('Submitting Quiz failed');
    expect(toast.error).toHaveBeenCalledWith('Deleting Quiz failed');
    expect(toast.error).toHaveBeenCalledWith('Deleting Question failed');
  });
});
