import { withErrorHandling } from './withErrorHandling.js';
import { logger } from '../config/logger.js';
import { GraphQLError } from 'graphql';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock('../config/logger.js', () => ({
  logger: { error: jest.fn() },
}));

const mockedLogger = jest.mocked(logger);

describe('withErrorHandling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the wrapped function result', async () => {
    const wrapped = withErrorHandling(
      async (value: number) => value * 2,
      'fail'
    );

    await expect(wrapped(2)).resolves.toBe(4);
    expect(mockedLogger.error).not.toHaveBeenCalled();
  });

  it('rethrows GraphQLErrors unchanged', async () => {
    const original = new GraphQLError('original error');
    const wrapped = withErrorHandling(async () => {
      throw original;
    }, 'fallback');

    await expect(wrapped()).rejects.toBe(original);
    expect(mockedLogger.error).not.toHaveBeenCalled();
  });

  it('logs unexpected errors and throws the fallback message', async () => {
    const wrapped = withErrorHandling(async () => {
      throw new Error('database down');
    }, 'fallback message');

    await expect(wrapped()).rejects.toThrow('fallback message');
    expect(mockedLogger.error).toHaveBeenCalledWith('fallback message', {
      message: 'database down',
      stack: expect.any(String),
    });
  });

  it('stringifies non-Error throwables', async () => {
    const wrapped = withErrorHandling(async () => {
      throw 'plain failure';
    }, 'fallback');

    await expect(wrapped()).rejects.toThrow('fallback');
    expect(mockedLogger.error).toHaveBeenCalledWith('fallback', {
      message: 'plain failure',
      stack: undefined,
    });
  });
});
