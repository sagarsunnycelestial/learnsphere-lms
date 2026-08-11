import {
  AuthPayload,
  LoginArgs,
  LoginUserBody,
  RegisterArgs,
  UserRoles,
} from '../../types/types.js';
import crypto from 'crypto';
import { Response } from 'express';
import { AppDataSource } from '../config/dbConfig.js';
import { Roles, Users } from '../entities/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { envSchema } from '../config/env.js';
import { GraphQLError } from 'graphql';
import { ERROR_MESSAGES } from '../constants/messages.js';
const loginUser = async (args: LoginArgs, res: Response) => {
  try {
    const { email, password }: LoginUserBody = args.input;
    const userRepo = AppDataSource.getRepository(Users);
    const user = await userRepo.findOne({
      where: {
        email: email,
      },
      relations: {
        role: true,
      },
    });
    if (!user || !user.isActive) {
      throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND);
    } else {
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        throw new GraphQLError(ERROR_MESSAGES.PASSWORD_NOT_MATCHING);
      } else {
        const payload = {
          user_id: user.userId,
          role: user.role.roleName,
        };
        const accessToken = jwt.sign(payload, envSchema.ACCESS_TOKEN_SECRET, {
          expiresIn: '15min',
        });
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const refreshToken_hash = crypto
          .createHmac('sha256', envSchema.REFRESH_TOKEN_SECRET)
          .update(refreshToken, 'utf8')
          .digest('hex');
        user.refreshToken = refreshToken_hash;
        user.isActive = true;
        user.rtokenGeneratedAt = new Date();
        await userRepo.save(user);
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: true,
          maxAge: 604800000,
        });

        return {
          accessToken: accessToken,
          role: user.role.roleName,
          profile_image_path: user.profile_image_path,
        };
      }
    }
  } catch (err) {
    return err;
  }
};
const registerUserInDB = async (args: RegisterArgs, user: AuthPayload) => {
  const userRepo = AppDataSource.getRepository(Users);
  const rolesRepo = AppDataSource.getRepository(Roles);
  try {
    const { username, email, role, collegeName } = args.input;

    const admin = await userRepo.findOne({
      where: {
        userId: user.user_id,
        role: {
          roleName: UserRoles.ADMIN,
        },
      },
      relations: {
        role: true,
      },
    });
    if (!admin) throw new GraphQLError(ERROR_MESSAGES.ADMIN_NOT_FOUND);

    const userRole = await rolesRepo.findOne({
      where: {
        roleId: role,
      },
    });
    if (!userRole) throw new GraphQLError(ERROR_MESSAGES.ROLE_NOT_FOUND);

    const temp_password =
      username.slice(0, 4) + email.slice(0, 4) + Math.floor(1000 + Math.random() * 9000);
    const password_hash = await bcrypt.hash(temp_password, 10);
    const newUser = userRepo.create({
      username: username,
      email: email,
      role: userRole,
      collegeName: collegeName,
      passwordHash: password_hash,
      isActive: true,
    });
    await userRepo.save(newUser);

    return {
      message: `${newUser.role.roleName} created successfully`,
      email: newUser.email,
      temp_password: temp_password,
    };
  } catch (error) {
    throw new GraphQLError(`${ERROR_MESSAGES.FAILED_TO_CREATE_USER} ${(error as Error).message}`);
  }
};

async function fetchUserByRefreshToken(refreshToken: string, res: Response) {
  const userRepo = AppDataSource.getRepository(Users);

  const hashedRefreshToken = crypto
    .createHmac('sha256', envSchema.REFRESH_TOKEN_SECRET)
    .update(refreshToken, 'utf8')
    .digest('hex');

  const user = await userRepo.findOne({
    where: {
      refreshToken: hashedRefreshToken,
    },
    relations: {
      role: true,
    },
  });
  if (!user) {
    throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND);
  } else {
    if (user.rtokenGeneratedAt) {
      const now = new Date();
      const lasLoginAt = new Date(user.rtokenGeneratedAt);
      const sevenDaysInMs = envSchema.REFRESH_TOKEN_EXPIRY_TIME;
      if (now.getTime() - lasLoginAt.getTime() > sevenDaysInMs) {
        throw new GraphQLError(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
      } else {
        const payload = {
          user_id: user.userId,
          role: user.role.roleName,
        };
        const accessToken = jwt.sign(payload, envSchema.ACCESS_TOKEN_SECRET, {
          expiresIn: '15min',
        });
        return {
          accessToken: accessToken,
          role: user.role.roleName,
          profile_image_path: user.profile_image_path,
        };
      }
    } else {
      throw new GraphQLError(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
    }
  }
}

async function removeRefreshToken(userId: string) {
  const userRepo = AppDataSource.getRepository(Users);
  try {
    const user = await userRepo.findOne({
      where: {
        userId: userId,
      },
    });
    if (!user) throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND);

    user.refreshToken = '';
    await userRepo.save(user);
    return { message: 'User logged out successfully' };
  } catch (err) {
    return { message: err };
  }
}
export { loginUser, registerUserInDB, fetchUserByRefreshToken, removeRefreshToken };
