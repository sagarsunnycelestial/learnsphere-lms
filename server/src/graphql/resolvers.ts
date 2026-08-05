import { GraphQLError } from "graphql/error"
import { Context, UserRoles,LoginArgs } from "../../types/types.js"
import { loginUser,registerUserInDB,fetchUserByRefreshToken ,removeRefreshToken} from "../controllers/auth.controller.js"
import { updateUserDetails,fetchUserProfile } from "../controllers/users.controller.js"
import { RegisterArgs,UpdateArgs,AuthPayload } from "../../types/types.js"
import { Response ,Request} from "express"
import { ERROR_MESSAGES } from "../constants/messages.js"
import { fetchRolesfromDB } from "../controllers/roles.controller.js"
export const resolvers = {
  Query:{
    fetchProfile:async(
       _parents: unknown,
      _args:unknown,
      context:Context
    )=>{
      return await fetchUserProfile(context.user?.user_id as string)
    },
    fetchRoles:async(
       _parents: unknown,
      _args:unknown,
      context:Context
    )=>{
      if(context.user?.role != UserRoles.ADMIN || !context.user) throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED)
        return await fetchRolesfromDB();
    },
     refreshEndpoint:async(
      _parents: unknown,
      _args:unknown,
      { req,res }: { req:Request,res: Response }
    ) =>{
      const cookies = req.cookies
      if(!cookies?.jwt) throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED, {
          extensions: { code: "FORBIDDEN" },
        });
      
        const refreshToken = cookies.jwt
         const foundUser = await fetchUserByRefreshToken(refreshToken,res);
        return foundUser;
        },
  },
  Mutation:{
        login: async (
      _parents: unknown,
      args: LoginArgs,
      { res }: { res: Response },
    ) => {
      return await loginUser(args, res);
    },
    registerUser: async(
      _parents:unknown,
      args:RegisterArgs,
      context:Context
    ) =>{
      if(context.user?.role != UserRoles.ADMIN || !context.user) throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED)
      const registerResponse = await registerUserInDB(args
        ,context.user
        
      );
      return registerResponse;
      
    },
     updateProfile: async(
      _parents:unknown,
      args:UpdateArgs,
      context:Context
     )=>{
      if(!context.user) throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND)

      return await updateUserDetails(args,context.user)
     },
       logout:async(
    _parents:unknown,
      _args:unknown,
      {res,user}:{res:Response,user:AuthPayload | null}
  ) =>{
    if(!user) throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND)
    const response = await removeRefreshToken(user?.user_id)
  res.clearCookie('jwt',{
    httpOnly:true,
    secure:true,
    sameSite:'lax',
  })
  return response
  },
    
  },

}