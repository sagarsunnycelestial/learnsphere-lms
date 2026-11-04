/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import useLessonsCRUD from './useLessonsCRUD';
import { apolloClient } from '../graphql/apolloClient';
import { createTestQueryClient } from '../test/render';
import { toast } from 'react-toastify';

vi.mock('../graphql/apolloClient', () => ({
  apolloClient: { mutate: vi.fn() },
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

describe('useLessonsCRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds a lesson and returns the server message', async () => {
    const { client, wrapper } = buildWrapper();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    mockedMutate.mockResolvedValue({
      data: { addALesson: { message: 'lesson created' } },
    } as any);
    const { result } = renderHook(() => useLessonsCRUD(), { wrapper });

    let message: any;
    await act(async () => {
      message = await result.current.addNewLesson({
        input: { courseId: 'course-1', lessonName: 'Lesson' },
      } as any);
    });

    expect(message).toBe('lesson created');
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['course', 'course-1'],
    });
  });

  it('throws when adding a lesson returns no data', async () => {
    const { wrapper } = buildWrapper();
    mockedMutate.mockResolvedValue({ data: null } as any);
    const { result } = renderHook(() => useLessonsCRUD(), { wrapper });

    await act(async () => {
      await expect(
        result.current.addNewLesson({ input: {} } as any)
      ).rejects.toThrow('No response from server');
    });

    expect(toast.error).toHaveBeenCalledWith('Adding a lesson failed');
  });

  it('updates and deletes lessons', async () => {
    const { client, wrapper } = buildWrapper();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    mockedMutate.mockResolvedValue({
      data: { editALesson: { message: 'updated' } },
    } as any);
    const { result } = renderHook(() => useLessonsCRUD(), { wrapper });

    await act(async () => {
      await result.current.updateLesson({
        input: { courseId: 'course-1', lessonId: 'lesson-1' },
      } as any);
    });

    mockedMutate.mockResolvedValue({
      data: { deleteALesson: { message: 'deleted' } },
    } as any);
    await act(async () => {
      await result.current.deleteLesson({
        input: { courseId: 'course-1', lessonId: 'lesson-1' },
      } as any);
    });

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['course', 'course-1'],
    });
  });

  it('reports edit and delete failures', async () => {
    const { wrapper } = buildWrapper();
    mockedMutate.mockRejectedValue(new Error('failed'));
    const { result } = renderHook(() => useLessonsCRUD(), { wrapper });

    await act(async () => {
      await expect(
        result.current.updateLesson({
          input: { courseId: 'course-1' },
        } as any)
      ).rejects.toThrow('failed');
    });
    expect(toast.error).toHaveBeenCalledWith('Editing lesson failed');

    await act(async () => {
      await expect(
        result.current.deleteLesson({
          input: { courseId: 'course-1' },
        } as any)
      ).rejects.toThrow('failed');
    });
    expect(toast.error).toHaveBeenCalledWith('Deleting lesson failed');
  });
});
