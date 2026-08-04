import { LoginArgs,LoginUserBody } from "../../types/types.js";
import { Response } from "express";
import { AppDataSource } from "../config/dbConfig.js";
import { Users } from "../entities/index.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { envSchema } from "../config/env.js";
const loginUser = async(args:LoginArgs,res:Response) =>{
  try{

    const { email, password }: LoginUserBody = args.input;
    const userRepo = AppDataSource.getRepository(Users);
    const user = await userRepo.findOne({
      where:{
        email:email,
      }
    })
    if(!user || !user.isActive){
      throw new Error("User not found or deactivated")
    }
    else {
      const match = await bcrypt.compare(password,user.passwordHash);
      if(!match){
        throw new Error('Unauthorized')
      }
      else {
        const payload = {
          user_id: user.userId,
          role:user.role,
        };
        const accessToken = jwt.sign(payload,envSchema.ACCESS_TOKEN_SECRET, {
          expiresIn:"1d",
        });
        const refreshToken = jwt.sign(payload,envSchema.REFRESH_TOKEN_SECRET, {
          expiresIn:"7d",
        });
        user.refreshToken= refreshToken;
        await userRepo.save(user);
        res.cookie('jwt',refreshToken,{
          httpOnly:true,
          sameSite:'lax',
          secure:true,
          maxAge:604800000,
        })

        return {
          accessToken:accessToken,
          role:user.role,
          profile_image_path:user.profile_image_path,
        }
      }
    }
  }
  catch(err){
    return err;
  }
}

export {loginUser}