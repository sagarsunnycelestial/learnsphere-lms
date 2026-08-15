import {
  AuthPayload,
  LoginArgs,
  LoginUserBody,
  RegisterArgs,
  UserRoles,
} from '../../types/types.js';
import crypto from 'crypto';
import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { envSchema } from '../config/env.js';
import { GraphQLError } from 'graphql';
import { ERROR_MESSAGES } from '../constants/messages.js';
import { userRepo, rolesRepo } from '../entities/repos.js';
import { sendWelcomeEmail } from '../services/mail.service.js';
import { withErrorHandling } from '../utils/withErrorHandling.js';
const loginUserRaw = async (args: LoginArgs, res: Response) => {
  const { email, password }: LoginUserBody = args.input;
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
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new GraphQLError(ERROR_MESSAGES.PASSWORD_NOT_MATCHING);
  }
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
};
const registerUserInDBRaw = async (args: RegisterArgs, user: AuthPayload) => {
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

    if (!admin) {
      throw new GraphQLError(ERROR_MESSAGES.ADMIN_NOT_FOUND);
    }

    const userRole = await rolesRepo.findOne({
      where: {
        roleId: role,
      },
    });

    if (!userRole) {
      throw new GraphQLError(ERROR_MESSAGES.ROLE_NOT_FOUND);
    }

    const temp_password =
      username.slice(0, 4) + email.slice(0, 4) + Math.floor(1000 + Math.random() * 9000);

    const password_hash = await bcrypt.hash(temp_password, 10);

    const newUser = userRepo.create({
      username,
      email,
      role: userRole,
      collegeName,
      passwordHash: password_hash,
      isActive: true,
    });

    await userRepo.save(newUser);

    await sendWelcomeEmail(newUser.email, newUser.username, temp_password);

    return {
      message: `${newUser.role.roleName} created successfully`,
      email: newUser.email,
      temp_password,
    };
};

async function fetchUserByRefreshTokenRaw(refreshToken: string) {
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
  } 
     if (!user.rtokenGeneratedAt) throw new GraphQLError(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);

      const now = new Date();
      const lasLoginAt = new Date(user.rtokenGeneratedAt);
      const sevenDaysInMs = envSchema.REFRESH_TOKEN_EXPIRY_TIME;
      if (now.getTime() - lasLoginAt.getTime() > sevenDaysInMs) {
        throw new GraphQLError(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
      }
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

async function removeRefreshTokenRaw(userId: string) {
    const user = await userRepo.findOne({
      where: {
        userId: userId,
      },
    });
    if (!user) throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND);

    user.refreshToken = '';
    await userRepo.save(user);
    return { message: 'User logged out successfully' };
}
export const loginUser = withErrorHandling(loginUserRaw,ERROR_MESSAGES.LOGIN_FAILED)
export const registerUserInDB = withErrorHandling(registerUserInDBRaw,ERROR_MESSAGES.FAILED_TO_CREATE_USER)
export const  fetchUserByRefreshToken = withErrorHandling(fetchUserByRefreshTokenRaw,ERROR_MESSAGES.REFRESH_TOKEN_INVALID)
export const removeRefreshToken = withErrorHandling(removeRefreshTokenRaw,ERROR_MESSAGES.LOGOUT_FAILED)
