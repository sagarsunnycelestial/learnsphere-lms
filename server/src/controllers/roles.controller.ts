import { ERROR_MESSAGES } from '../constants/messages.js';
import { GraphQLError } from 'graphql';
import { rolesRepo } from '../entities/repos.js';
async function fetchRolesfromDB() {
  try {
    const roles = await rolesRepo.find();
    if (!roles) throw new GraphQLError(ERROR_MESSAGES.ROLE_NOT_FOUND);
    // console.log(roles)
    return roles;
  } catch (err) {
    throw new GraphQLError(err as string);
  }
}
export { fetchRolesfromDB };
