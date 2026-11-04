/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import useFetchStudents from './useFetchStudents';
import { apolloClient } from '../graphql/apolloClient';
import { createTestQueryClient } from '../test/render';

vi.mock('../graphql/apolloClient', () => ({
  apolloClient: { query: vi.fn() },
}));

const mockedQuery = vi.mocked(apolloClient.query);

function buildWrapper() {
  const client = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { wrapper };
}

describe('useFetchStudents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not fetch until enabled', async () => {
    const { wrapper } = buildWrapper();

    const { result } = renderHook(() => useFetchStudents('course-1', false), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedQuery).not.toHaveBeenCalled();
  });

  it('fetches students for a course when enabled', async () => {
    const students = [{ userId: 'student-1' }];
    mockedQuery.mockResolvedValue({
      data: { fetchStudents: students },
    } as any);
    const { wrapper } = buildWrapper();

    const { result } = renderHook(() => useFetchStudents('course-1', true), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(students);
    expect(mockedQuery).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { courseId: 'course-1' } })
    );
  });
});
