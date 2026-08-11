import { GraphQLError } from 'graphql';
import { UserRoles } from '../../types/types.js';
import { AppDataSource } from '../config/dbConfig.js';
import { Users } from '../entities/Users.js';
import { ERROR_MESSAGES } from '../constants/messages.js';

async function fetchStudentDetails(args: { courseId?: string }) {
  const userRepo = AppDataSource.getRepository(Users);
  try {
    const students = await userRepo.find({
      where: {
        role: {
          roleName: UserRoles.STUDENT,
        },
      },
      relations: {
        enrollments: {
          course: true,
        },
        results: true,
      },
    });
    if (!students) throw new GraphQLError(ERROR_MESSAGES.STUDENTS_NOT_FOUND);

    if (!args.courseId) return students;

    const filteredStudents = students.map((student) => {
      const isEnrolled = student.enrollments.some(
        (enrollment) => enrollment.course.courseId === args.courseId
      );
      return { ...student, isEnrolled: isEnrolled };
    });
    return filteredStudents;
  } catch (err) {
     if (err instanceof GraphQLError) {
      throw err;
    }
    throw new GraphQLError(ERROR_MESSAGES.STUDENTS_NOT_FOUND);
  }
}
export { fetchStudentDetails };
