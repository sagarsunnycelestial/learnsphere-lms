/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import useFetchProfile from './useFetchProfile';
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

describe('useFetchProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the current user profile', async () => {
    const profile = { userId: 'user-1', username: 'user' };
    mockedQuery.mockResolvedValue({ data: { fetchProfile: profile } } as any);
    const { wrapper } = buildWrapper();

    const { result } = renderHook(() => useFetchProfile(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(profile);
    expect(mockedQuery).toHaveBeenCalledWith(
      expect.objectContaining({ fetchPolicy: 'network-only' })
    );
  });

  it('surfaces a query error when no profile is available', async () => {
    mockedQuery.mockResolvedValue({ data: null } as any);
    const { wrapper } = buildWrapper();

    const { result } = renderHook(() => useFetchProfile(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
