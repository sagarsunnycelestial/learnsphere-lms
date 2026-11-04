/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { googleLoginThunk } from './googleLoginThunk';
import { apolloClient } from '../../graphql/apolloClient';

vi.mock('../../graphql/apolloClient', () => ({
  apolloClient: { mutate: vi.fn() },
}));

const mockedMutate = vi.mocked(apolloClient.mutate);

async function run() {
  return (await googleLoginThunk({ input: { idToken: 'id-token' } })(
    vi.fn(),
    () => ({}),
    undefined
  )) as any;
}

describe('googleLoginThunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the google login payload', async () => {
    mockedMutate.mockResolvedValue({
      data: {
        googleLogin: {
          accessToken: 'google-token',
          role: 'Student',
          profile_image_path: null,
        },
      },
    } as any);

    const action = await run();

    expect(action.payload.accessToken).toBe('google-token');
    expect(mockedMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { input: { idToken: 'id-token' } },
      })
    );
  });

  it('rejects when the server returns no login', async () => {
    mockedMutate.mockResolvedValue({ data: null } as any);

    const action = await run();

    expect(action.payload).toEqual({ message: 'Login failed' });
  });

  it('rejects with the thrown error message', async () => {
    mockedMutate.mockRejectedValue(new Error('Popup blocked'));

    const action = await run();

    expect(action.payload).toEqual({ message: 'Popup blocked' });
  });

  it('rejects with a fallback for non-Error throwables', async () => {
    mockedMutate.mockRejectedValue(null);

    const action = await run();

    expect(action.payload).toEqual({ message: 'Login failed' });
  });
});
