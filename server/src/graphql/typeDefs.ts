export const typeDefs =`

enum UserRole {
ADMIN
INSTRUCTOR
STUDENT

}

input UserDetails {
username:String!
email:String!
role:UserRole
collegeName:String
}

type RegisterResponse {
message:String!
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

type Query {
  _empty: String
}


type Mutation {
  login(input:LoginCredentials!): LoginResponse!
  registerUser(input:UserDetails!): [RegisterResponse]!
}
`