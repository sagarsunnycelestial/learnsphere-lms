/* eslint-disable */

import { updateUserDetails, fetchUserProfile } from './users.controller.js';
import { userRepo } from '../entities/repos.js';
import bcrypt from 'bcrypt';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { ERROR_MESSAGES } from '../constants/messages.js';

jest.mock('../entities/repos.js', () => ({
  userRepo: {
    findOne: jest.fn(),
    save: jest.fn(),
  },
}));
jest.mock('bcrypt');

const mockedUserRepo = jest.mocked(userRepo);
const mockedBcrypt = jest.mocked(bcrypt);

function buildUser(overrides: Record<string, unknown> = {}) {
  return {
    userId: 'user-1',
    username: 'oldname',
    email: 'old@test.com',
    passwordHash: 'old-hash',
    profile_image_path: '/old.png',
    collegeName: 'Old College',
    ...overrides,
  } as any;
}

describe('Users controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUserDetails', () => {
    const authUser = { user_id: 'user-1', role: 'Student' };

    it('updates all provided fields', async () => {
      const user = buildUser();
      mockedUserRepo.findOne.mockResolvedValue(user as any);
      mockedBcrypt.hash.mockResolvedValue('new-hash' as never);

      const result = await updateUserDetails(
        {
          input: {
            username: 'newname',
            email: 'new@test.com',
            password: 'newpass',
            profile_image_path: '/new.png',
            collegeName: 'New College',
          },
        } as any,
        authUser
      );

      expect(result.message).toBe('newname details has been updated');
      expect(user).toEqual(
        expect.objectContaining({
          username: 'newname',
          email: 'new@test.com',
          passwordHash: 'new-hash',
          profile_image_path: '/new.png',
          collegeName: 'New College',
        })
      );
      expect(mockedUserRepo.save).toHaveBeenCalledWith(user);
    });

    it('keeps the existing password when none is provided', async () => {
      const user = buildUser();
      mockedUserRepo.findOne.mockResolvedValue(user as any);

      await updateUserDetails(
        {
          input: {
            username: '',
            email: '',
            password: '',
            profile_image_path: '',
            collegeName: '',
          },
        } as any,
        authUser
      );

      expect(user.passwordHash).toBe('old-hash');
      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
    });

    it('rejects an unknown user', async () => {
      mockedUserRepo.findOne.mockResolvedValue(null);

      await expect(
        updateUserDetails(
          {
            input: {
              username: '',
              email: '',
              password: '',
              profile_image_path: '',
              collegeName: '',
            },
          } as any,
          authUser
        )
      ).rejects.toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
    });

    it('rejects a password that is too short', async () => {
      mockedUserRepo.findOne.mockResolvedValue(buildUser() as any);

      await expect(
        updateUserDetails(
          {
            input: {
              username: '',
              email: '',
              password: 'abc',
              profile_image_path: '',
              collegeName: '',
            },
          } as any,
          authUser
        )
      ).rejects.toThrow(ERROR_MESSAGES.PASSWORD_NOT_VALID);
    });

    it('rejects a password with surrounding spaces', async () => {
      mockedUserRepo.findOne.mockResolvedValue(buildUser() as any);

      await expect(
        updateUserDetails(
          {
            input: {
              username: '',
              email: '',
              password: ' pass ',
              profile_image_path: '',
              collegeName: '',
            },
          } as any,
          authUser
        )
      ).rejects.toThrow(ERROR_MESSAGES.PASSWORD_NOT_VALID);
    });
  });

  describe('fetchUserProfile', () => {
    it('returns the user profile with relations', async () => {
      const profile = buildUser();
      mockedUserRepo.findOne.mockResolvedValue(profile as any);

      await expect(fetchUserProfile('user-1')).resolves.toBe(profile);
      expect(mockedUserRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1' } })
      );
    });
  });
});
