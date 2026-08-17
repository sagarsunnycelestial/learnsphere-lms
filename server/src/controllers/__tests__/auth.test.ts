/* eslint-disable */

import { loginUser } from '../auth.controller.js';
import { rolesRepo, userRepo } from '../../entities/repos.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';

jest.mock('../../entities/repos.js', () => ({
  userRepo: {
    findOne: jest.fn(),
    save: jest.fn(),
  },
  rolesRepo: {
    findOne: jest.fn(),
  },
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    const user = {
      userId: '1',
      email: 'test@gmail.com',
      passwordHash: 'hashed-password',
      isActive: true,
      role: {
        roleName: 'STUDENT',
      },
      profile_image_path: '/image.jpg',
    };

    (userRepo.findOne as any).mockResolvedValue(user);
    (rolesRepo.findOne as any)
      .mockResolvedValue('STUDENT')(bcrypt.compare as any)
      .mockResolvedValue(true);
    (jwt.sign as any).mockResolvedValue('access-token');

    const res = {
      cookie: jest.fn(),
    } as any;

    const result = await loginUser(
      {
        input: {
          email: 'test@gmail.com',
          password: 'password123',
        } as any,
      },
      res
    );
    expect(result.accessToken).toBe('access-token');
    expect(result.role).toBe('STUDENT');
  });
});
