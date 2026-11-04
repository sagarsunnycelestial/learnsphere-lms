/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import useFetchCourses from './useFetchCourses';
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
  return { client, wrapper };
}

describe('useFetchCourses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the fetched courses', async () => {
    const courses = [{ courseId: 'course-1' }];
    mockedQuery.mockResolvedValue({ data: { fetchCourses: courses } } as any);
    const { wrapper } = buildWrapper();

    const { result } = renderHook(
      () => useFetchCourses({ filter: { status: 'active' } }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(courses);
    expect(mockedQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { filter: { status: 'active' } },
        fetchPolicy: 'network-only',
      })
    );
  });

  it('surfaces a query error when the response has no data', async () => {
    mockedQuery.mockResolvedValue({ data: null } as any);
    const { wrapper } = buildWrapper();

    const { result } = renderHook(() => useFetchCourses({ filter: {} }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it('exposes query errors', async () => {
    mockedQuery.mockRejectedValue(new Error('network'));
    const { wrapper } = buildWrapper();

    const { result } = renderHook(() => useFetchCourses({ filter: {} }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
