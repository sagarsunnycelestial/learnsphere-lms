/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { loginThunk } from './loginThunk';
import { apolloClient } from '../../graphql/apolloClient';

vi.mock('../../graphql/apolloClient', () => ({
  apolloClient: { mutate: vi.fn() },
}));

const mockedMutate = vi.mocked(apolloClient.mutate);

async function run(credentials = { email: 'a@b.com', password: 'secret' }) {
  return (await loginThunk(credentials)(vi.fn(), () => ({}), undefined)) as any;
}

describe('loginThunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the login payload', async () => {
    mockedMutate.mockResolvedValue({
      data: {
        login: {
          accessToken: 'token',
          role: 'Admin',
          profile_image_path: '/avatar.png',
        },
      },
    } as any);

    const action = await run();

    expect(action.payload.accessToken).toBe('token');
    expect(mockedMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { input: { email: 'a@b.com', password: 'secret' } },
      })
    );
  });

  it('rejects when the server returns no login', async () => {
    mockedMutate.mockResolvedValue({ data: null } as any);

    const action = await run();

    expect(action.payload).toEqual({ message: 'Login failed' });
  });

  it('rejects with the thrown error message', async () => {
    mockedMutate.mockRejectedValue(new Error('Network down'));

    const action = await run();

    expect(action.payload).toEqual({ message: 'Network down' });
  });

  it('rejects with a fallback for non-Error throwables', async () => {
    mockedMutate.mockRejectedValue('boom');

    const action = await run();

    expect(action.payload).toEqual({ message: 'Login failed' });
  });
});
