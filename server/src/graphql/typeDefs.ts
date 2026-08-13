export const typeDefs = `



input UserDetails {
username:String!
email:String!
role:String!
collegeName:String!
profile_image_path:String
}

type StudentResponse {
userId:String!
username:String!
email:String!
collegeName:String!
profile_image_path:String
results:[BasicResultResponse]
isEnrolled:Boolean
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

type OptionResponse {
optionId:String
optionText:String
}

type QuestionResponse {
questionId:String
questionText:String
options:[OptionResponse]
}

type QuizResponse {
quizId:String
quizName:String
questions:[QuestionResponse]

}
type ResultResponse {
resultId:String
quiz:QuizResponse
score:Float
}
type BasicResultResponse{
resultId:String
score:Float
}
type CreatedBy{
profile_image_path:String
username:String
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
  type EnrollmentUser {
  userId:String!
username:String!
email:String!
profile_image_path:String
collegeName:String!
  }

  type Enrollments {
  enrollmentId: String
enrolledAt:String
isActive:Boolean
user:EnrollmentUser
  }
  
  type Courses {
  courseId:String
courseName:String
description:String
isActive:Boolean
thumbnail_image_path:String
createdBy: CreatedBy
lessons: [LessonResponse]
enrollments:[Enrollments]
quizzes:[QuizResponse]
isEnrolled:Boolean
canModify:Boolean
  }
type SingleCourse {
courseId:String
courseName:String
description:String
isActive:Boolean
thumbnail_image_path:String
createdBy: CreatedBy
lessons: [LessonResponse]
enrollments:[Enrollments]
quizzes:[QuizResponse]
isEnrolled:Boolean
canModify:Boolean
totalEnrolled: Int
totalLessons: Int
}

input CoursesFilter {
status:String
}
type Query {
refreshEndpoint:LoginResponse
fetchRoles:[RoleResponse]
fetchProfile:UserResponse
fetchCourses(filter:CoursesFilter!):[Courses]
fetchCourseById(courseId:String!):SingleCourse!
fetchStudents(courseId:String):[StudentResponse]

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
input EnrollDetails {
 courseId: String!
 userId: String
 }
 input LessonDetails {
 lessonId:String
  courseId:String!
  lessonName:String!
  description:String
  videoLink:String
  sortOrder:Int
 }
input DeleteLessonDetails {
courseId:String
lessonId:String
}
input QuizDetails {
  quizName:String!
  courseId:String!
}


  input QuestionDetails {
    quizId:String
    questionText:String
    correctOption:String
    options:[String]
  }

   input AnswerInput {
   questionId:String
   selectionOption:String
   }
  input QuizAnswerDetails {
  quizId:String
  answerList: [AnswerInput]
  }
  type QuizResultResponse {
  message:String
  courseDetail:CourseResponse
  userId:String
  username:String
  profile_image_path:String
  resultId:String
  quizId:String
  quizName:String
  score:Float
  }

type Mutation {
  login(input:LoginCredentials!): LoginResponse!
  registerUser(input:UserDetails!): RegisterResponse!
  updateProfile(input:UpdateDetails!) : Response!
  logout:Response
  createCourse(input:CourseDetails!) : Response!
  editCourse(input:UpdateCourseDetails) : Response!
  deleteCourse(courseId: String!): Response!
  enrollCourse(input:EnrollDetails):Response!
  addALesson(input:LessonDetails):Response!
  editALesson(input:LessonDetails):Response!
  deleteALesson(input:DeleteLessonDetails!):Response!
  createAQuiz(input:QuizDetails):Response!
  createAQuestion(input:QuestionDetails):Response!
  submitQuiz(input:QuizAnswerDetails): QuizResultResponse!
  deleteQuiz(quizId:String!): Response!
  deleteQuestion(questionId:String!,quizId:String!): Response!
  unenrollStudent(input:EnrollDetails):Response!
}
`;
