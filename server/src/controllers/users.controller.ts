import { GraphQLError } from 'graphql';
import { AuthPayload, UpdateArgs } from '../../types/types.js';
import { ERROR_MESSAGES } from '../constants/messages.js';
import bcrypt from 'bcrypt';
import { userRepo } from '../entities/repos.js';
import { withErrorHandling } from '../utils/withErrorHandling.js';
async function updateUserDetailsRaw(args: UpdateArgs, user: AuthPayload) {
  const { username, email, password, profile_image_path, collegeName } = args.input;
  const updateUser = await userRepo.findOne({
    where: {
      userId: user.user_id,
    },
  });
  if (!updateUser) throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND);

  let password_hash = updateUser.passwordHash;

  if (password) {
    const isStrongPassword =
      password.length >= 4 && password.trim() === password && password.trim().length > 0;

    if (!isStrongPassword) {
      throw new GraphQLError(ERROR_MESSAGES.PASSWORD_NOT_VALID);
    }

    password_hash = await bcrypt.hash(password, 10);
  }
  updateUser.passwordHash = password_hash;
  if (username) {
    updateUser.username = username;
  }

  if (email) {
    updateUser.email = email;
  }

  if (profile_image_path) {
    updateUser.profile_image_path = profile_image_path;
  }

  if (collegeName) {
    updateUser.collegeName = collegeName;
  }
  await userRepo.save(updateUser);

  return { message: `${updateUser.username} details has been updated` };
}

async function fetchUserProfileRaw(userId: string) {
  const userProfile = userRepo.findOne({
    where: {
      userId: userId,
    },
    relations: {
      role: true,
      enrollments: {
        course: true,
      },
      courses: true,
      results: { quiz: true },
    },
  });
  if (!userProfile) throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND);

  return userProfile;
}

export const updateUserDetails = withErrorHandling(
  updateUserDetailsRaw,
  ERROR_MESSAGES.FAILED_TO_UPDATE_USER
);
export const fetchUserProfile = withErrorHandling(
  fetchUserProfileRaw,
  ERROR_MESSAGES.USER_NOT_FOUND
);
