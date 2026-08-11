import {
  Courses,
  Enrollments,
  Lessons,
  Options,
  Questions,
  Quizzes,
  Results,
  Roles,
  Users,
} from './index.js';
import { AppDataSource } from '../config/dbConfig.js';

const courseRepo = AppDataSource.getRepository(Courses);
const userRepo = AppDataSource.getRepository(Users);
const enrollmentRepo = AppDataSource.getRepository(Enrollments);
const rolesRepo = AppDataSource.getRepository(Roles);
const lessonRepo = AppDataSource.getRepository(Lessons);
const quizRepo = AppDataSource.getRepository(Quizzes);
const questionRepo = AppDataSource.getRepository(Questions);
const optionRepo = AppDataSource.getRepository(Options);
const resultRepo = AppDataSource.getRepository(Results);
export {
  courseRepo,
  userRepo,
  enrollmentRepo,
  rolesRepo,
  lessonRepo,
  questionRepo,
  quizRepo,
  optionRepo,
  resultRepo,
};
