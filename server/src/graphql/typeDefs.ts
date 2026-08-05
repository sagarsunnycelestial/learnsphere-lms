export const typeDefs =`



input UserDetails {
username:String!
email:String!
role:String!
collegeName:String!
profile_image_path:String
}
type UserResponse {
username:String!
email:String!
profile_image_path:String
role:RoleResponse
courses:[CourseResponse]
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

type Query {
refreshEndpoint:LoginResponse
fetchRoles:[RoleResponse]
fetchProfile:UserResponse
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

type Mutation {
  login(input:LoginCredentials!): LoginResponse!
  registerUser(input:UserDetails!): RegisterResponse!
  updateProfile(input:UpdateDetails!) : Response!
  logout:Response
}
`