export const typeDefs = `



input UserDetails {
username:String!
email:String!
role:String!
collegeName:String!
profile_image_path:String
}
type EnrollmentResponse {
enrollmentId: String
enrolledAt:String
isActive:Boolean
course: CourseResponse

}
type UserResponse {
username:String!
email:String!
profile_image_path:String
role:RoleResponse
courses:[CourseResponse]
enrollments:[EnrollmentResponse]
results:[ResultResponse]
collegeName:String!
}
type CourseResponse {
courseId:String
courseName:String
isActive:Boolean
}

type QuizResponse {
quizId:String
quizName:String

}
type ResultResponse {
resultId:String
quiz:QuizResponse
score:Float
}

type CreatedBy{
profile_image_path:String
userName:String
userId:String
}
type RegisterResponse {
message:String!
email:String!
temp_password:String!
}
input LoginCredentials {
  email: String!
  password:String!
}

type LoginResponse {
  accessToken:String
  role:String
  profile_image_path:String
}
type RoleResponse {
  roleName:String
  roleId:String
}
  type LessonResponse{
  lessonId:String
  lessonName:String
  description:String
  videoLink:String
  sortOrder:Int
  }

  type Enrollments {
  enrollmentId: String
enrolledAt:String
isActive:Boolean
  }
  
  
  type Courses {
  courseId:String
courseName:String
isActive:Boolean
thumbnail_image_path:String
createdBy: CreatedBy
lessons: [LessonResponse]
enrollments:[Enrollments]
quizzes:[QuizResponse]
  }

type Query {
refreshEndpoint:LoginResponse
fetchRoles:[RoleResponse]
fetchProfile:UserResponse
fetchCourses:[Courses]
}

input UpdateDetails {
username:String!
email:String!
password:String!
collegeName:String!
profile_image_path:String
}

type Response {
message: String!
}
input CourseDetails {
courseName:String
description:String
thumbnail_image_path:String
}

input UpdateCourseDetails {
courseId:String
courseName:String
description:String
thumbnail_image_path:String
 isActive:Boolean
}

type Mutation {
  login(input:LoginCredentials!): LoginResponse!
  registerUser(input:UserDetails!): RegisterResponse!
  updateProfile(input:UpdateDetails!) : Response!
  logout:Response
  createCourse(input:CourseDetails!) : Response!
  editCourse(input:UpdateCourseDetails) : Response!
  deleteCourse(courseId: String!): Response!
}
`;
