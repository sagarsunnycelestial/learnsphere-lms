export const typeDefs =`



input UserDetails {
username:String!
email:String!
role:String!
collegeName:String!
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

type Query {
refreshEndpoint:LoginResponse
}


type Mutation {
  login(input:LoginCredentials!): LoginResponse!
  registerUser(input:UserDetails!): RegisterResponse!
}
`