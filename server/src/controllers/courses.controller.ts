
import { GraphQLError } from "graphql/error/GraphQLError.js";
import { CourseUpdateArgs,Context } from "../../types/types.js";
import { AppDataSource } from "../config/dbConfig.js";
import { Courses } from "../entities/Courses.js";
import { Users } from "../entities/Users.js";
import { ERROR_MESSAGES } from "../constants/messages.js";

async function createACourse(args:CourseUpdateArgs,context:Context){
  const courseRepo = AppDataSource.getRepository(Courses)
  const userRepo = AppDataSource.getRepository(Users)
  const {courseName,description,thumbnail_image_path} = args.input
  if(context.user?.user_id){
  const creatingUser = await userRepo.findOne({
    where:{
      userId:context.user?.user_id
    },
    relations:{
      courses:true,
    }
  })

  if(!creatingUser) throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND)

  try{
const newCourse = courseRepo.create({
    courseName: courseName,
    description:description,
    createdBy:creatingUser,
    thumbnail_image_path:thumbnail_image_path,
  })
  if(!newCourse) throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_CREATE_COURSE)
    await courseRepo.save(newCourse)
  return {message: 'Course created successfully'}

  }catch(err){
   
  }
  
  }
 

}
async function fetchAllCourses(){
  const courseRepo = AppDataSource.getRepository(Courses)
  try{
const courses = await courseRepo.find({relations:{
  createdBy:true,
  lessons:true,
  enrollments:true,
  quizzes:true
}})
if(!courses) throw new GraphQLError(ERROR_MESSAGES.COURSES_NOT_FOUND)

return courses;
  }catch(err){
  throw new GraphQLError(ERROR_MESSAGES.FAILED_TO_FETCH_COURSES)
  }
  
}
export {createACourse,fetchAllCourses}