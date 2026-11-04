/* eslint-disable */
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  let contextCallback: any;
  const concat = vi.fn(() => 'combined-link');
  const setContextLink = vi.fn(function (this: any, callback: any) {
    contextCallback = callback;
    return { concat };
  });
  const httpLink = vi.fn(function (this: any) {
    return { kind: 'http' };
  });
  const inMemoryCache = vi.fn(function (this: any) {
    return { kind: 'cache' };
  });
  const apolloClient = vi.fn(function (this: any) {
    return { kind: 'client' };
  });

  return {
    concat,
    setContextLink,
    httpLink,
    inMemoryCache,
    apolloClient,
    getContextCallback: () => contextCallback,
  };
});

vi.mock('@apollo/client', () => ({
  ApolloClient: mocks.apolloClient,
  HttpLink: mocks.httpLink,
  InMemoryCache: mocks.inMemoryCache,
  gql: (strings: TemplateStringsArray) => strings.join(''),
}));
vi.mock('@apollo/client/link/context', () => ({
  SetContextLink: mocks.setContextLink,
}));

describe('apolloClient', () => {
  it('configures the HTTP link with the server url and cookies', async () => {
    await import('./apolloClient');

    expect(mocks.httpLink).toHaveBeenCalledWith({
      uri: 'http://localhost:3000/graphql',
      credentials: 'include',
    });
    expect(mocks.apolloClient).toHaveBeenCalledWith({
      link: 'combined-link',
      cache: { kind: 'cache' },
    });
  });

  it('adds the bearer token from the redux store', async () => {
    await import('./apolloClient');
    const { default: store } = await import('../store/store');
    const { refreshUser } = await import('../store/slices/authSlice');
    const contextCallback = mocks.getContextCallback();

    store.dispatch(
      refreshUser({
        accessToken: null,
        role: 'Student',
        isAuthenticated: false,
        profile_image_path: null,
      })
    );
    expect(contextCallback({ headers: { 'x-test': '1' } })).toEqual({
      headers: { 'x-test': '1', authorization: '' },
    });

    store.dispatch(
      refreshUser({
        accessToken: 'token-123',
        role: 'Admin',
        isAuthenticated: true,
        profile_image_path: null,
      })
    );
    expect(contextCallback({ headers: {} })).toEqual({
      headers: { authorization: 'Bearer token-123' },
    });
  });
});
