/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import useFetchCourseById from './useFetchCourseById';
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

describe('useFetchCourseById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches a course by id', async () => {
    const course = { courseId: 'course-1', courseName: 'Test' };
    mockedQuery.mockResolvedValue({
      data: { fetchCourseById: course },
    } as any);
    const { wrapper } = buildWrapper();

    const { result } = renderHook(() => useFetchCourseById('course-1'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(course);
    expect(mockedQuery).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { courseId: 'course-1' } })
    );
  });

  it('surfaces a query error when the course is missing', async () => {
    mockedQuery.mockResolvedValue({ data: {} } as any);
    const { wrapper } = buildWrapper();

    const { result } = renderHook(() => useFetchCourseById('missing'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
