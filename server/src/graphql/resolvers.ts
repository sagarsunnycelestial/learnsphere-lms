import { GraphQLError } from 'graphql/error';
import {
  Context,
  UserRoles,
  LoginArgs,
  EnrollCourseArgs,
  LessonUpdateArgs,
  DeleteLessonArgs,
  QuestionArgs,
  SubmitQuizArgs,
} from '../../types/types.js';
import {
  loginUser,
  registerUserInDB,
  fetchUserByRefreshToken,
  removeRefreshToken,
} from '../controllers/auth.controller.js';
import { updateUserDetails, fetchUserProfile } from '../controllers/users.controller.js';
import { RegisterArgs, UpdateArgs, AuthPayload, CourseUpdateArgs } from '../../types/types.js';
import { Response, Request } from 'express';
import { ERROR_MESSAGES } from '../constants/messages.js';
import { fetchRolesfromDB } from '../controllers/roles.controller.js';
import {
  createACourse,
  fetchAllCourses,
  editCourseDetails,
  deleteCourseFromDB,
  fetchASingleCourse,
  enrollAStudent,
} from '../controllers/courses.controller.js';
import {
  createAQuizForCourse,
  createAQuestionForQuiz,
  submitQuizAnswers,
} from '../controllers/quiz.controller.js';
import { fetchStudentDetails } from '../controllers/student.controller.js';
import {
  addLessonToCourse,
  editLessonInCourse,
  deleteLessonInCourse,
} from '../controllers/lessons.controller.js';
export const resolvers = {
  Query: {
    fetchProfile: async (_parents: unknown, _args: unknown, context: Context) => {
      if (!context.user?.user_id) throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND);

      return await fetchUserProfile(context.user?.user_id as string);
    },
    fetchRoles: async (_parents: unknown, _args: unknown, context: Context) => {
      if (context.user?.role != UserRoles.ADMIN || !context.user)
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);
      return await fetchRolesfromDB();
    },
    refreshEndpoint: async (
      _parents: unknown,
      _args: unknown,
      { req, res }: { req: Request; res: Response }
    ) => {
      const cookies = req.cookies;
      if (!cookies?.jwt)
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED, {
          extensions: { code: 'FORBIDDEN' },
        });

      const refreshToken = cookies.jwt;
      const foundUser = await fetchUserByRefreshToken(refreshToken, res);
      return foundUser;
    },
    fetchCourses: async (_parents: unknown, _args: unknown, context: Context) => {
      if (!context.user?.user_id) throw new GraphQLError(ERROR_MESSAGES.COURSES_NOT_FOUND);
      return await fetchAllCourses(context.user.user_id, context.user.role);
    },
    fetchCourseById: async (_parents: unknown, args: { courseId: string }, context: Context) => {
      if (!context.user?.user_id) throw new GraphQLError(ERROR_MESSAGES.COURSES_NOT_FOUND);

      return await fetchASingleCourse(args.courseId, context.user);
    },
    fetchStudents: async (_parents: unknown, args: { courseId?: string }, context: Context) => {
      if (context.user?.role === UserRoles.STUDENT || !context.user)
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);

      return await fetchStudentDetails(args);
    },
  },
  Mutation: {
    login: async (_parents: unknown, args: LoginArgs, { res }: { res: Response }) => {
      return await loginUser(args, res);
    },
    registerUser: async (_parents: unknown, args: RegisterArgs, context: Context) => {
      if (context.user?.role != UserRoles.ADMIN || !context.user)
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);
      const registerResponse = await registerUserInDB(args, context.user);
      return registerResponse;
    },
    updateProfile: async (_parents: unknown, args: UpdateArgs, context: Context) => {
      if (!context.user) throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND);

      return await updateUserDetails(args, context.user);
    },
    logout: async (
      _parents: unknown,
      _args: unknown,
      { res, user }: { res: Response; user: AuthPayload | null }
    ) => {
      if (!user) throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND);
      const response = await removeRefreshToken(user?.user_id);
      res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
      return response;
    },
    createCourse: async (_parents: unknown, args: CourseUpdateArgs, context: Context) => {
      if (
        !context.user?.user_id ||
        (context.user?.role !== UserRoles.INSTRUCTOR && context.user?.role !== UserRoles.ADMIN)
      )
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);

      return await createACourse(args, context);
    },
    editCourse: async (_parents: unknown, args: CourseUpdateArgs, context: Context) => {
      if (
        !context.user?.user_id ||
        (context.user?.role !== UserRoles.INSTRUCTOR && context.user?.role !== UserRoles.ADMIN)
      )
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);

      return await editCourseDetails(args);
    },
    deleteCourse: async (_parents: unknown, args: { courseId: string }, context: Context) => {
      if (
        !context.user?.user_id ||
        (context.user?.role !== UserRoles.INSTRUCTOR && context.user?.role !== UserRoles.ADMIN)
      )
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);
      return await deleteCourseFromDB(args.courseId);
    },
    enrollCourse: async (_parents: unknown, args: EnrollCourseArgs, context: Context) => {
      if (context.user?.role === UserRoles.INSTRUCTOR)
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);

      return await enrollAStudent(args, context);
    },
    addALesson: async (_parents: unknown, args: LessonUpdateArgs, context: Context) => {
      if (context.user?.role === UserRoles.STUDENT)
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);

      return await addLessonToCourse(args, context);
    },
    editALesson: async (_parents: unknown, args: LessonUpdateArgs, context: Context) => {
      if (context.user?.role === UserRoles.STUDENT)
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);

      return await editLessonInCourse(args, context);
    },
    deleteALesson: async (_parents: unknown, args: DeleteLessonArgs, context: Context) => {
      if (context.user?.role === UserRoles.STUDENT)
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);

      return await deleteLessonInCourse(args, context);
    },
    createAQuiz: async (
      _parents: unknown,
      args: {
        input: {
          courseId: string;
          quizName: string;
        };
      },
      context: Context
    ) => {
      if (context.user?.role === UserRoles.STUDENT)
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);

      return await createAQuizForCourse(args, context);
    },
    createAQuestion: async (_parents: unknown, args: QuestionArgs, context: Context) => {
      if (context.user?.role === UserRoles.STUDENT)
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);

      return await createAQuestionForQuiz(args, context);
    },
    submitQuiz: async (_parents: unknown, args: SubmitQuizArgs, context: Context) => {
      if (context.user?.role !== UserRoles.STUDENT)
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED);

      return await submitQuizAnswers(args, context);
    },
  },
};
