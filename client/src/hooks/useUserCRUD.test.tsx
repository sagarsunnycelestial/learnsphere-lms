/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import useUserCRUD from './useUserCRUD';
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

describe('useUserCRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds a user and invalidates the users list', async () => {
    const { client, wrapper } = buildWrapper();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    const response = { registerUser: { email: 'new@test.com' } };
    mockedMutate.mockResolvedValue({ data: response } as any);
    const { result } = renderHook(() => useUserCRUD(), { wrapper });

    let data: any;
    await act(async () => {
      data = await result.current.addNewUser({
        input: {
          username: 'newuser',
          email: 'new@test.com',
          role: 'role-1',
          collegeName: 'College',
        },
      } as any);
    });

    expect(data).toEqual(response);
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['users-list'] });
  });

  it('throws when adding a user returns no data', async () => {
    const { wrapper } = buildWrapper();
    mockedMutate.mockResolvedValue({ data: null } as any);
    const { result } = renderHook(() => useUserCRUD(), { wrapper });

    await act(async () => {
      await expect(
        result.current.addNewUser({ input: {} } as any)
      ).rejects.toThrow('No response from server');
    });
  });

  it('updates the profile', async () => {
    const { wrapper } = buildWrapper();
    mockedMutate.mockResolvedValue({
      data: { updateProfile: { message: 'updated' } },
    } as any);
    const { result } = renderHook(() => useUserCRUD(), { wrapper });

    let response: any;
    await act(async () => {
      response = await result.current.updateProfile({ input: {} } as any);
    });

    expect(response).toEqual({ message: 'updated' });
  });

  it('enrolls and unenrolls students, invalidating related caches', async () => {
    const { client, wrapper } = buildWrapper();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    const { result } = renderHook(() => useUserCRUD(), { wrapper });

    mockedMutate.mockResolvedValue({
      data: { enrollCourse: { message: 'enrolled' } },
    } as any);
    await act(async () => {
      await result.current.enrollStudent({
        input: { userId: 'student-1', courseId: 'course-1' },
      } as any);
    });

    mockedMutate.mockResolvedValue({
      data: { unenrollStudent: { message: 'unenrolled' } },
    } as any);
    await act(async () => {
      await result.current.unEnrollStudent({
        input: { userId: 'student-1', courseId: 'course-1' },
      } as any);
    });

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['student-profile', 'course-1'],
    });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['course'] });
  });

  it('reports update, enroll and unenroll failures', async () => {
    const { wrapper } = buildWrapper();
    mockedMutate.mockRejectedValue(new Error('failed'));
    const { result } = renderHook(() => useUserCRUD(), { wrapper });

    const calls = [
      () => result.current.updateProfile({ input: {} } as any),
      () => result.current.enrollStudent({ input: {} } as any),
      () => result.current.unEnrollStudent({ input: {} } as any),
    ];

    for (const call of calls) {
      await act(async () => {
        await expect(call()).rejects.toThrow('failed');
      });
    }

    expect(toast.error).toHaveBeenCalledWith('Update Failed');
  });
});
