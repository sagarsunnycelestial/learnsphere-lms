/* eslint-disable */

import { loginUser } from '../auth.controller.js';
import { rolesRepo, userRepo } from '../../entities/repos.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { ERROR_MESSAGES } from '../../constants/messages.js';

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
      .mockResolvedValue('STUDENT');
      (bcrypt.compare as any)
      .mockResolvedValue(true);
    (jwt.sign as any).mockReturnValue('access-token');

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


  it('should not login when user does not exist', async () => {
  (userRepo.findOne as any).mockResolvedValue(null);

  const res = {
    cookie: jest.fn(),
  } as any;

  await expect(
    loginUser(
      {
        input: {
          email: '',
          password: '',
        } as any,
      },
      res
    )
  ).rejects.toThrow();

  expect(jwt.sign).not.toHaveBeenCalled();
  expect(res.cookie).not.toHaveBeenCalled();
});
it('should not login with wrong password',async()=>{
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
 (bcrypt.compare as any).mockResolvedValue(false);

  const res = {
    cookie: jest.fn(),
  } as any;

   await expect(loginUser({input:{
    email:'test@gmail.com',
    password:'wrong-password'
   }},res)).rejects.toThrow(ERROR_MESSAGES.PASSWORD_NOT_MATCHING);

   expect(jwt.sign).not.toHaveBeenCalled()
   expect(res.cookie).not.toHaveBeenCalled();

})
});
