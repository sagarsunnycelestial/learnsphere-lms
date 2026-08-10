export interface AuthInitialState {
   status:'idle' | 'loading' | 'succeeded' |'failed',
  user:{
accessToken:string | null,
  role:UserRoles,
  isAuthenticated:boolean,
  profile_image_path:string | null
  },
  error:{message:string} | null
}
export const UserRoles  ={
  ADMIN : 'Admin',
  INSTRUCTOR : 'Instructor',
  STUDENT : 'Student'
}  as const
export type UserRoles = (typeof UserRoles)[keyof typeof UserRoles];
export type LoginInputs =  {
  email:string;
  password: string;
}
export interface RefreshResponse {
  refreshEndpoint: {
    accessToken:string,
  role:UserRoles,
  profile_image_path: string | null,
  }
}
export interface LoginResponse {
 login:{
   accessToken:string,
  role:UserRoles,
  profile_image_path: string | null,
 }
}


export interface LoginMutationVariables {
  input: LoginInputs;
}

export interface UserDetails {
  collegeName:string;
  email:string;
  role:UserRoles;
  userName:string
}

type Course = {
  courseName:string
  courseId:string
  description:string
  thumbnail_image_path:string;
  isActive:boolean
}
export type FormInitialState  = {

 users: {
 mode: string;
 isUserAddFormOpen: boolean;
 selectedUser: null | UserDetails;
 createdUser:{
  didValueReceive:boolean;
  email:string;
  temp_password:string
 }
 };
 courses: {
 mode: string;
 isAddCourseFormOpen: boolean;
 selectedcourse: Course | null;
 };

}

export interface RegisterResponse {
  registerUser:{
message:string
email?:string
temp_password?:string
  }
  
}
export interface RegisterMutationInput {
  input: {
    password?:string
    collegeName: string,
    email: string,
    role: string,
    username: string,
  }
}
export interface FetchRoleResponse {
  fetchRoles:{roleId:string,roleName:string}[]
}
