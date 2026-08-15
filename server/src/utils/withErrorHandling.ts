import { GraphQLError } from "graphql";


export function withErrorHandling<Args extends unknown[],Return>(fn:(...args:Args)=>Promise<Return>,fallbackMessage:string):(...args:Args)=>Promise<Return> {
  return async(...args)=>{
    try{
      return await fn(...args);
    }catch(err){
      if(err instanceof GraphQLError){
        throw err;
      }
      console.log(`[${fallbackMessage}]`, err);
      throw new GraphQLError(fallbackMessage)
    }
  }
}