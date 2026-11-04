/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import useCoursesCRUD from './useCoursesCRUD';
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

describe('useCoursesCRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds a course and invalidates the course cache', async () => {
    const { client, wrapper } = buildWrapper();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    mockedMutate.mockResolvedValue({
      data: { createCourse: { message: 'created' } },
    } as any);
    const { result } = renderHook(() => useCoursesCRUD(), { wrapper });

    let response: any;
    await act(async () => {
      response = await result.current.addNewCourse({
        input: { courseName: 'Test', description: 'Desc' },
      } as any);
    });

    expect(response).toEqual({ message: 'created' });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['course'] });
  });

  it('throws and reports when adding a course returns no data', async () => {
    const { wrapper } = buildWrapper();
    mockedMutate.mockResolvedValue({ data: null } as any);
    const { result } = renderHook(() => useCoursesCRUD(), { wrapper });

    await act(async () => {
      await expect(
        result.current.addNewCourse({ input: {} } as any)
      ).rejects.toThrow('No response from server');
    });

    expect(toast.error).toHaveBeenCalledWith('Adding course failed');
  });

  it('updates a course and invalidates both cache keys', async () => {
    const { client, wrapper } = buildWrapper();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    mockedMutate.mockResolvedValue({
      data: { editCourse: { message: 'edited' } },
    } as any);
    const { result } = renderHook(() => useCoursesCRUD(), { wrapper });

    await act(async () => {
      await result.current.updateCourse({
        input: { courseId: 'course-1', courseName: 'Updated' },
      } as any);
    });

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['course'] });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['course', 'course-1'],
    });
  });

  it('reports update failures', async () => {
    const { wrapper } = buildWrapper();
    mockedMutate.mockRejectedValue(new Error('failed'));
    const { result } = renderHook(() => useCoursesCRUD(), { wrapper });

    await act(async () => {
      await expect(
        result.current.updateCourse({ input: {} } as any)
      ).rejects.toThrow('failed');
    });

    expect(toast.error).toHaveBeenCalledWith('Update failed');
  });

  it('deletes a course and reports failures', async () => {
    const { client, wrapper } = buildWrapper();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    mockedMutate.mockResolvedValue({
      data: { deleteCourse: { message: 'deleted' } },
    } as any);
    const { result } = renderHook(() => useCoursesCRUD(), { wrapper });

    await act(async () => {
      await result.current.deleteCourse({ courseId: 'course-1' } as any);
    });

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['course', 'course-1'],
    });

    mockedMutate.mockRejectedValue(new Error('failed'));
    await act(async () => {
      await expect(
        result.current.deleteCourse({ courseId: 'course-1' } as any)
      ).rejects.toThrow('failed');
    });
    expect(toast.error).toHaveBeenCalledWith('Delete failed');
  });
});
