import { AppDataSource } from '../config/dbConfig.js';
import { ERROR_MESSAGES } from '../constants/messages.js';
import { Roles } from '../entities/Roles.js';
import { GraphQLError } from 'graphql';

async function fetchRolesfromDB() {
  try {
    const roleRepo = AppDataSource.getRepository(Roles);
    const roles = await roleRepo.find();
    if (!roles) throw new GraphQLError(ERROR_MESSAGES.ROLE_NOT_FOUND);
    // console.log(roles)
    return roles;
  } catch (err) {
    throw new GraphQLError(err as string);
  }
}
export { fetchRolesfromDB };
