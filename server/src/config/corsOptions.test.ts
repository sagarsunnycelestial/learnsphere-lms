/* eslint-disable */

import { corsOptions } from './corsOptions.js';
import { allowedOrigins } from './allowedOrgins.js';
import { describe, expect, it, jest } from '@jest/globals';

describe('corsOptions', () => {
  it('allows configured origins', () => {
    const callback = jest.fn();

    (corsOptions.origin as any)(allowedOrigins[0], callback);

    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('allows requests without an origin', () => {
    const callback = jest.fn();

    (corsOptions.origin as any)(undefined, callback);

    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('rejects unknown origins', () => {
    const callback = jest.fn();

    (corsOptions.origin as any)('https://evil.test', callback);

    expect(callback).toHaveBeenCalledWith(expect.any(Error));
    expect((callback.mock.calls[0][0] as Error).message).toBe(
      'Not allowed by CORS'
    );
  });

  it('exposes the configured method and header policy', () => {
    expect(corsOptions.methods).toEqual(['POST', 'GET', 'OPTIONS']);
    expect(corsOptions.allowedHeaders).toEqual([
      'Content-Type',
      'Authorization',
    ]);
    expect(corsOptions.credentials).toBe(true);
  });
});
