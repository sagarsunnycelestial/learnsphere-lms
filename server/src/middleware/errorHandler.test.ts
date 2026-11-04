/* eslint-disable */

import errorHandler from './errorHandler.js';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

function buildResponse() {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
}

describe('errorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 409 for errors with a code', () => {
    const res = buildResponse();
    const next = jest.fn();
    const error = { code: '23505', message: 'duplicate' };

    errorHandler(error as any, {} as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error });
    expect(next).toHaveBeenCalled();
  });

  it('returns the error status when present', () => {
    const res = buildResponse();
    const error = { status: 404, message: 'not found' };

    errorHandler(error as any, {} as any, res as any, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'not found' });
  });

  it('falls back to 500', () => {
    const res = buildResponse();
    const error = new Error('boom');

    errorHandler(error as any, {} as any, res as any, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error });
  });
});
