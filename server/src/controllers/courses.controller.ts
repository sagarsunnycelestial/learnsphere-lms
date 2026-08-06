import { GraphQLError } from "graphql/error/GraphQLError.js";
import { CourseUpdateArgs, Context, UpdateArgs } from "../../types/types.js";
import { AppDataSource } from "../config/dbConfig.js";
import { Courses } from "../entities/Courses.js";
import { Users } from "../entities/Users.js";
import { ERROR_MESSAGES } from "../constants/messages.js";

async function createACourse(args: CourseUpdateArgs, context: Context) {
  const courseRepo = AppDataSource.getRepository(Courses);
  const userRepo = AppDataSource.getRepository(Users);
  const { courseName, description, thumbnail_image_path } = args.input;
  if (context.user?.user_id) {
    const creatingUser = await userRepo.findOne({
      where: {
        userId: context.user?.user_id,
      },
      relations: {
        courses: true,
      },
    });

    if (!creatingUser) throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND);

    try {
      const newCourse = courseRepo.create({
        courseName: courseName,
        description: description,
        createdBy: creatingUser,
        thumbnail_image_path: thumbnail_image_path,
      });
      if (!newCourse)
        throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_CREATE_COURSE);
      await courseRepo.save(newCourse);
      return { message: "Course created successfully" };
    } catch (err) {}
  }
}
async function fetchAllCourses(userId:string) {
  const courseRepo = AppDataSource.getRepository(Courses);
  try {
    const courses = await courseRepo.find({
      relations: {
        createdBy: true,
        lessons: true,
        enrollments:{
          user:true
        },
        quizzes: true,
      },
    });
    if (!courses) throw new GraphQLError(ERROR_MESSAGES.COURSES_NOT_FOUND);
    const filteredcourses = courses.map((course)=>{
     const isEnrolled = course.enrollments.some(
      (enrollment) =>enrollment.user.userId === userId
     )
     return {...course,isEnrolled}
    })
    return filteredcourses;
  } catch (err) {
    throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_FETCH_COURSES);
  }
}

async function editCourseDetails(args: CourseUpdateArgs) {
  const courseRepo = AppDataSource.getRepository(Courses);
  const { courseName, courseId, description, thumbnail_image_path,isActive } =
    args.input;
  try {
    if (!courseId) throw new GraphQLError(ERROR_MESSAGES.COURSES_ID_INVALID);

    const updatedCourse = await courseRepo.findOne({
      where: {
        courseId: courseId,
      },
    });
    if (!updatedCourse)
      throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_EDIT_COURSE);
    if(description){
 updatedCourse.description = description;
    }
    if(courseName){
    updatedCourse.courseName = courseName;
    }

   
    if (thumbnail_image_path) {
      updatedCourse.thumbnail_image_path = thumbnail_image_path;
    }
    if(isActive === false){
      updatedCourse.isActive = false
    } else updatedCourse.isActive = true
    
    await courseRepo.save(updatedCourse);
    return { message: "Course edited successfully" };
  } catch (err) {
    throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_FETCH_COURSES);
  }
}

async function deleteCourseFromDB(courseId:string){
  const courseRepo = AppDataSource.getRepository(Courses);
  try{
    const deletedCourse = await courseRepo.findOne({
      where:{
        courseId:courseId
      }
    })
    if(!deletedCourse) throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_DELETE_COURSE);
    await courseRepo.remove(deletedCourse)
    return {message:'Course deleted successfully'}
  }catch(err){
    throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_FETCH_COURSES);
  }
}

export { createACourse, fetchAllCourses, editCourseDetails,deleteCourseFromDB };
