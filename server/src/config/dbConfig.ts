
import { DataSource } from "typeorm";
import { envSchema } from "./env.js";
import { Users,Lessons,Questions,Quizzes,Results,Roles,Courses,Options,Enrollments } from "../entities/index.js";

export const AppDataSource = new DataSource({
  type:envSchema.DB_TYPE,
   url:envSchema.SUPABASE_DB_URL,
    entities:[Users,Roles,Courses,Lessons,Quizzes,Questions,Options,Results,Enrollments],
    synchronize: false,
    migrations: ['src/migrations/*.ts'],
    ssl: envSchema.DB_SSL ? { rejectUnauthorized: false } : false,
})