import { allowedOrigins } from "./allowedOrgins.js";
import { CorsOptions } from "cors";

export const corsOptions:CorsOptions ={
  origin:(origin,callback) => {
    if(allowedOrigins.includes(origin as string) || !origin){
      callback(null,true)
    }
    else{
      callback(new Error('Not allowd by CORS'))
    }
  },
  allowedHeaders:['POST','GET','OPTIONS'],
  credentials:true,
  optionsSuccessStatus:204,
  maxAge:86400,
}