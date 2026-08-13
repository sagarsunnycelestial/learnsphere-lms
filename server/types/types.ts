/* eslint-disable @typescript-eslint/no-namespace */
import type { Request, Response } from 'express';

export enum UserRoles {
  ADMIN = 'Admin',
  INSTRUCTOR = 'Instructor',
  STUDENT = 'Student',
}

export type RegisterCredentials = {
  username: string;
  email: string;
  role: string;
  collegeName: string;
};
export interface AuthPayload {
  user_id: string;
  role: string;
}
export interface Context {
  req: Request;
  res: Response;
  user: AuthPayload | null;
}

export type LoginUserBody = {
  email: string;
  password: string;
};

declare global {
  namespace Express {
    interface Request {
      user: {
        user_id?: string | null;
        role?: UserRoles | null;
      } | null;
    }
  }
}

export interface LoginArgs {
  input: LoginUserBody;
}

export interface RegisterArgs {
  input: RegisterCredentials;
}

type UpdateDetails = {
  username: string;
  password: string;
  email: string;
  collegeName: string;
  profile_image_path: string;
};
export interface UpdateArgs {
  input: UpdateDetails;
}

type CourseUpdate = {
  courseId?: string;
  isActive?: boolean;
  courseName: string;
  description: string;
  thumbnail_image_path: string | null;
};
export type CourseUpdateArgs = {
  input: CourseUpdate;
};
export type EnrollDetails = {
  courseId: string;
  userId?: string;
};
export type EnrollCourseArgs = {
  input: EnrollDetails;
};
export type LessonDetails = {
  courseId: string;
  lessonId?: string;
  lessonName: string;
  description?: string;
  videoLink?: string;
};
export type LessonUpdateArgs = {
  input: LessonDetails;
};
export type DeleteLessonArgs = {
  input: {
    courseId: string;
    lessonId: string;
  };
};

export interface QuestionDetails {
  quizId?: string;
  questionText?: string;
  correctOption?: string;
  options: string[];
}
export type QuestionArgs = {
  input: QuestionDetails;
};
export type AnswerInput = {
  questionId?: string;
  selectionOption?: string;
};

export type QuizAnswerDetails = {
  quizId?: string;
  answerList?: AnswerInput[];
};
export type SubmitQuizArgs = {
  input: QuizAnswerDetails;
};
