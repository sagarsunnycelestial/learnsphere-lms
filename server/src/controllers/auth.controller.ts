import { AuthPayload, Context, LoginArgs,LoginUserBody,RegisterArgs, UserRoles } from "../../types/types.js";
import { Response } from "express";
import { AppDataSource } from "../config/dbConfig.js";
import { Roles, Users } from "../entities/index.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { envSchema } from "../config/env.js";
import { GraphQLError } from "graphql";
const loginUser = async(args:LoginArgs,res:Response) =>{
  try{

    const { email, password }: LoginUserBody = args.input;
    const userRepo = AppDataSource.getRepository(Users);
    const user = await userRepo.findOne({
      where:{
        email:email,
      },
      relations:{
        role:true
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
          role:user.role.roleName,
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
          role:user.role.roleName,
          profile_image_path:user.profile_image_path,
        }
      }
    }
  }
  catch(err){
    return err;
  }
}
const registerUserInDB = async (args: RegisterArgs
  ,user:AuthPayload
) => {
  
  const userRepo = AppDataSource.getRepository(Users)
  const rolesRepo = AppDataSource.getRepository(Roles)
  try {
    
    const {
      username,
      email,
      role,
      collegeName
    } = args.input
  
  
const admin = await userRepo.findOne({
  where:{
    userId:user.user_id,
    role:{
      roleName:UserRoles.ADMIN
    }
  },
  relations:{
    role:true
  }
})
  if(!admin) throw new GraphQLError("Admin not found")

  const userRole = await rolesRepo.findOne({where:{
    roleId:role
  }})
  if(!userRole) throw new GraphQLError("Role not found")

   const temp_password =
      username.slice(0, 4) +
      email.slice(0, 4) +
      Math.floor(1000 + Math.random() * 9000);
    const password_hash = await bcrypt.hash(temp_password,10);
    const newUser = userRepo.create({
      username:username,
      email:email,
      role:userRole,
      collegeName:collegeName,
      passwordHash:password_hash,
      isActive:true,

    });
    await userRepo.save(newUser)

    return {
      message:`${newUser.role.roleName} created successfully`,
      email: newUser.email,
      temp_password: temp_password
    }
  } catch (error) {
    throw new Error(`Failed to create user: ${(error as Error).message}`);
  }
}


async function fetchUserByRefreshToken(refreshToken: string,res:Response) {
  const userRepo = AppDataSource.getRepository(Users)

   let decoded: AuthPayload;

  try {
    decoded = jwt.verify(
      refreshToken,
      envSchema.REFRESH_TOKEN_SECRET,
    ) as AuthPayload;
  } catch {
    throw new Error("Invalid refresh token")
  }
  const userfound = await userRepo.findOneBy({ refreshToken: refreshToken });
  if (!userfound) throw new Error("User has no refresh token");

  const user = await userRepo.findOne({
    where:{
      userId: decoded.user_id
    },
    relations:{
      role:true
    }
  })
  if(!user){
throw new GraphQLError('User not found')
  } 
  
    else{
 const payload = {
          user_id: user.userId,
          role:user.role.roleName,
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
          role:user.role.roleName,
          profile_image_path:user.profile_image_path,
        }

    }
  
}
export {loginUser,registerUserInDB,fetchUserByRefreshToken}