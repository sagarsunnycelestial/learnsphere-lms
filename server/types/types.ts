export enum UserRoles {
  ADMIN = 'Admin',
  INSTRUCTOR = 'Instructor',
  STUDENT = 'Student'
}

export type RegisterCredentials ={
  username:string,
  email:string,
  role:string
  collegeName:string
}
export interface AuthPayload {
  user_id: string;
  role: string;
}
export interface Context {
  req: Request;
  res: Response;
  user: AuthPayload | null
}

export type LoginUserBody = {
  email:string,
  password:string
}

declare global {
  namespace Express {
    interface Request {
              /** Parsed cookies that have not been signed */
        cookies: Record<string, any>;
        /** Parsed cookies that have been signed */
        signedCookies: Record<string, any>;
      user: {
         user_id?: string | null,
      role?: UserRoles | null,
      } | null,
     
    }
  }
}

export interface LoginArgs {
  input:LoginUserBody,
}


export interface RegisterArgs {
  input:RegisterCredentials
}