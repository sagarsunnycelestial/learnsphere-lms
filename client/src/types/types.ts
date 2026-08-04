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

export type LoginInputs =  {
  email:string;
  password: string;
}
export interface RefreshResponse {
  refreshEndpoint: LoginResponse | null;
}
export interface LoginResponse {
  accessToken:string,
  role:UserRoles,
  profile_image_path: string | null,
}