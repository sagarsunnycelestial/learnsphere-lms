import verifyJWT from './verifyJWT.js';
import jwt from 'jsonwebtoken';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock('jsonwebtoken');

const mockedJwt = jest.mocked(jwt);

describe('verifyJWT', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the decoded payload', () => {
    const payload = { user_id: 'user-1', role: 'Admin' };
    mockedJwt.verify.mockReturnValue(payload as never);

    expect(verifyJWT('token')).toEqual(payload);
    expect(mockedJwt.verify).toHaveBeenCalledWith('token', expect.any(String));
  });

  it('propagates verification errors', () => {
    mockedJwt.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    expect(() => verifyJWT('token')).toThrow('invalid token');
  });
});
