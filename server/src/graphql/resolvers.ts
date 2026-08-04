import { GraphQLError } from "graphql/error"
import { Context, UserRoles,LoginArgs } from "../../types/types.js"
import { loginUser,registerUserInDB,fetchUserByRefreshToken } from "../controllers/auth.controller.js"
import { updateUserDetails } from "../controllers/users.controller.js"
import { RegisterArgs,UpdateArgs } from "../../types/types.js"
import { Response ,Request} from "express"
import { ERROR_MESSAGES } from "../constants/messages.js"

export const resolvers = {
  Query:{
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
      if(context.user?.role != UserRoles.ADMIN || !context.user) throw new GraphQLError('unauthorized')
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
     }
    
  }
}