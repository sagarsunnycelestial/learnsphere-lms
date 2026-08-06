
import { DataSource } from "typeorm";
import { envSchema } from "./env.js";
import { Users,Lessons,Questions,Quizzes,Results,Roles,Courses,Options,Enrollments } from "../entities/index.js";

export const AppDataSource = new DataSource({
  type:envSchema.DB_TYPE,
   host:envSchema.DB_HOST,
    port:envSchema.DB_PORT,
    username: envSchema.DB_USERNAME,
    password:envSchema.DB_PASSWORD ,
    database: envSchema.DB_NAME,
    entities:[Users,Roles,Courses,Lessons,Quizzes,Questions,Options,Results,Enrollments],
    synchronize: false,
    migrations: ['src/migrations/*.ts']
})