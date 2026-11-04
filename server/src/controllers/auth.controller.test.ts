/* eslint-disable */

import { loginUser } from './auth.controller.js';
import {
  registerUserInDB,
  fetchUserByRefreshToken,
  removeRefreshToken,
  googleLoginWithFB,
} from './auth.controller.js';
import { rolesRepo, userRepo } from '../entities/repos.js';
import { sendWelcomeEmail } from '../services/mail.service.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { ERROR_MESSAGES } from '../constants/messages.js';
import { firebaseAdminAuth } from '../config/firebaseAdmin.js';

jest.mock('../config/firebaseAdmin.js', () => ({
  firebaseAdminAuth: {
    verifyIdToken: jest.fn(),
  },
}));
jest.mock('../entities/repos.js', () => ({
  userRepo: {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  },
  rolesRepo: {
    findOne: jest.fn(),
  },
}));
jest.mock('../services/mail.service.js', () => ({
  sendWelcomeEmail: jest.fn(),
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockedBcrypt = jest.mocked(bcrypt);
const mockedJwt = jest.mocked(jwt);
const mockedUserRepo = jest.mocked(userRepo);
const mockedRolesRepo = jest.mocked(rolesRepo);
const mockedSendWelcomeEmail = jest.mocked(sendWelcomeEmail);
const mockedVerifyIdToken = jest.mocked(firebaseAdminAuth.verifyIdToken);

function buildResponse() {
  return { cookie: jest.fn(), clearCookie: jest.fn() } as any;
}

function buildUser(overrides: Record<string, unknown> = {}) {
  return {
    userId: '1',
    username: 'testuser',
    email: 'test@gmail.com',
    passwordHash: 'hashed-password',
    isActive: true,
    role: {
      roleName: 'Student',
    },
    profile_image_path: '/image.jpg',
    rtokenGeneratedAt: new Date(),
    refreshToken: '',
    ...overrides,
  } as any;
}

describe('Auth controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('logs in an active user and sets the refresh cookie', async () => {
      mockedUserRepo.findOne.mockResolvedValue(buildUser() as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.sign.mockReturnValue('access-token' as never);
      const res = buildResponse();

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
      expect(result.role).toBe('Student');
      expect(mockedUserRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ refreshToken: expect.any(String) })
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.any(String),
        expect.objectContaining({ httpOnly: true, secure: true })
      );
    });

    it('rejects an unknown user', async () => {
      mockedUserRepo.findOne.mockResolvedValue(null);
      const res = buildResponse();

      await expect(
        loginUser(
          { input: { email: 'missing@test.com', password: 'pass' } as any },
          res
        )
      ).rejects.toThrow(ERROR_MESSAGES.USER_NOT_FOUND);

      expect(mockedJwt.sign).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
    });

    it('rejects an inactive user', async () => {
      mockedUserRepo.findOne.mockResolvedValue(
        buildUser({ isActive: false }) as any
      );
      const res = buildResponse();

      await expect(
        loginUser(
          { input: { email: 'test@gmail.com', password: 'pass' } as any },
          res
        )
      ).rejects.toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
    });

    it('rejects a wrong password', async () => {
      mockedUserRepo.findOne.mockResolvedValue(buildUser() as any);
      mockedBcrypt.compare.mockResolvedValue(false as never);
      const res = buildResponse();

      await expect(
        loginUser(
          { input: { email: 'test@gmail.com', password: 'wrong' } as any },
          res
        )
      ).rejects.toThrow(ERROR_MESSAGES.PASSWORD_NOT_MATCHING);

      expect(mockedJwt.sign).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
    });
  });

  describe('registerUserInDB', () => {
    const registerArgs = {
      input: {
        username: 'newuser',
        email: 'new@test.com',
        role: 'role-1',
        collegeName: 'Test College',
      },
    } as any;

    it('creates a user when the caller is an admin', async () => {
      const admin = buildUser({ userId: 'admin-1' });
      const role = { roleId: 'role-1', roleName: 'Instructor' };
      const createdUser = buildUser({
        username: 'newuser',
        email: 'new@test.com',
        role,
      });
      mockedUserRepo.findOne.mockResolvedValue(admin as any);
      mockedRolesRepo.findOne.mockResolvedValue(role as any);
      mockedUserRepo.create.mockReturnValue(createdUser as any);
      mockedBcrypt.hash.mockResolvedValue('hashed' as never);

      const result = await registerUserInDB(registerArgs, {
        user_id: 'admin-1',
        role: 'Admin',
      });

      expect(result.message).toBe('Instructor created successfully');
      expect(result.email).toBe('new@test.com');
      expect(mockedUserRepo.save).toHaveBeenCalledWith(createdUser);
      expect(mockedSendWelcomeEmail).toHaveBeenCalledWith(
        'new@test.com',
        'newuser',
        expect.any(String)
      );
    });

    it('rejects a caller that is not an admin', async () => {
      mockedUserRepo.findOne.mockResolvedValue(null);

      await expect(
        registerUserInDB(registerArgs, {
          user_id: 'user-1',
          role: 'Instructor',
        })
      ).rejects.toThrow(ERROR_MESSAGES.ADMIN_NOT_FOUND);
    });

    it('rejects an unknown role id', async () => {
      mockedUserRepo.findOne.mockResolvedValue(buildUser() as any);
      mockedRolesRepo.findOne.mockResolvedValue(null);

      await expect(
        registerUserInDB(registerArgs, { user_id: 'admin-1', role: 'Admin' })
      ).rejects.toThrow(ERROR_MESSAGES.ROLE_NOT_FOUND);
    });
  });

  describe('fetchUserByRefreshToken', () => {
    it('returns a new access token for a fresh refresh token', async () => {
      mockedUserRepo.findOne.mockResolvedValue(
        buildUser({ rtokenGeneratedAt: new Date() }) as any
      );
      mockedJwt.sign.mockReturnValue('new-access-token' as never);

      const result = await fetchUserByRefreshToken('refresh-token');

      expect(result.accessToken).toBe('new-access-token');
      expect(result.role).toBe('Student');
    });

    it('rejects an unknown refresh token', async () => {
      mockedUserRepo.findOne.mockResolvedValue(null);

      await expect(fetchUserByRefreshToken('refresh-token')).rejects.toThrow(
        ERROR_MESSAGES.USER_NOT_FOUND
      );
    });

    it('rejects a token without a generation timestamp', async () => {
      mockedUserRepo.findOne.mockResolvedValue(
        buildUser({ rtokenGeneratedAt: undefined }) as any
      );

      await expect(fetchUserByRefreshToken('refresh-token')).rejects.toThrow(
        ERROR_MESSAGES.REFRESH_TOKEN_INVALID
      );
    });

    it('rejects an expired refresh token', async () => {
      mockedUserRepo.findOne.mockResolvedValue(
        buildUser({ rtokenGeneratedAt: new Date(0) }) as any
      );

      await expect(fetchUserByRefreshToken('refresh-token')).rejects.toThrow(
        ERROR_MESSAGES.REFRESH_TOKEN_INVALID
      );
    });
  });

  describe('removeRefreshToken', () => {
    it('clears the stored refresh token', async () => {
      const user = buildUser({ refreshToken: 'stored-hash' });
      mockedUserRepo.findOne.mockResolvedValue(user as any);

      const result = await removeRefreshToken('1');

      expect(result.message).toBe('User logged out successfully');
      expect(mockedUserRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ refreshToken: '' })
      );
    });

    it('rejects an unknown user', async () => {
      mockedUserRepo.findOne.mockResolvedValue(null);

      await expect(removeRefreshToken('missing')).rejects.toThrow(
        ERROR_MESSAGES.USER_NOT_FOUND
      );
    });
  });

  describe('googleLoginWithFB', () => {
    it('logs in an existing firebase user', async () => {
      mockedVerifyIdToken.mockResolvedValue({
        uid: 'firebase-1',
        email: 'test@gmail.com',
      } as any);
      mockedUserRepo.findOne.mockResolvedValue(buildUser() as any);
      mockedJwt.sign.mockReturnValue('google-token' as never);
      const res = buildResponse();

      const result = await googleLoginWithFB('id-token', res);

      expect(result.accessToken).toBe('google-token');
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.any(String),
        expect.any(Object)
      );
    });

    it('links a firebase uid to an existing email account', async () => {
      mockedVerifyIdToken.mockResolvedValue({
        uid: 'firebase-2',
        email: 'test@gmail.com',
      } as any);
      const existing = buildUser();
      mockedUserRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(existing as any);
      mockedJwt.sign.mockReturnValue('linked-token' as never);

      const result = await googleLoginWithFB('id-token', buildResponse());

      expect(result.accessToken).toBe('linked-token');
      expect(existing.firebaseUid).toBe('firebase-2');
      expect(mockedUserRepo.save).toHaveBeenCalledWith(existing);
    });

    it('rejects a token without an email', async () => {
      mockedVerifyIdToken.mockResolvedValue({ uid: 'firebase-3' } as any);

      await expect(
        googleLoginWithFB('id-token', buildResponse())
      ).rejects.toThrow(ERROR_MESSAGES.GOOGLE_NO_EMAIL);
    });

    it('rejects when no account matches the email', async () => {
      mockedVerifyIdToken.mockResolvedValue({
        uid: 'firebase-4',
        email: 'missing@test.com',
      } as any);
      mockedUserRepo.findOne.mockResolvedValue(null);

      await expect(
        googleLoginWithFB('id-token', buildResponse())
      ).rejects.toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
    });
  });
});
