import { GraphQLError } from "graphql/error"
import { Context, UserRoles,LoginArgs } from "../../types/types.js"
import { loginUser } from "../controllers/auth.controller.js"
import { RegisterArgs } from "../../types/types.js"
import { Response } from "express"

export const resolvers = {
  Query:{

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
      if(context.user?.role != UserRoles.ADMIN) throw new GraphQLError('unauthorized')
      
    }
  }
}