import { ERROR_MESSAGES } from '../constants/messages.js';
import { GraphQLError } from 'graphql';
import { rolesRepo } from '../entities/repos.js';
import { withErrorHandling } from '../utils/withErrorHandling.js';
async function fetchRolesfromDBRaw() {
  const roles = await rolesRepo.find();
  if (!roles) throw new GraphQLError(ERROR_MESSAGES.ROLE_NOT_FOUND);
  return roles;
}
export const fetchRolesfromDB = withErrorHandling(
  fetchRolesfromDBRaw,
  ERROR_MESSAGES.ROLE_NOT_FOUND
);
