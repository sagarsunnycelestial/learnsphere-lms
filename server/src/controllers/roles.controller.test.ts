/* eslint-disable */

import { fetchRolesfromDB } from './roles.controller.js';
import { rolesRepo } from '../entities/repos.js';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { ERROR_MESSAGES } from '../constants/messages.js';

jest.mock('../entities/repos.js', () => ({
  rolesRepo: {
    find: jest.fn(),
  },
}));

const mockedRolesRepo = jest.mocked(rolesRepo);

describe('Roles controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the available roles', async () => {
    const roles = [{ roleId: '1', roleName: 'Admin' }];
    mockedRolesRepo.find.mockResolvedValue(roles as any);

    await expect(fetchRolesfromDB()).resolves.toEqual(roles);
  });

  it('throws when roles cannot be fetched', async () => {
    mockedRolesRepo.find.mockResolvedValue(null as any);

    await expect(fetchRolesfromDB()).rejects.toThrow(
      ERROR_MESSAGES.ROLE_NOT_FOUND
    );
  });
});
