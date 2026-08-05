import { GraphQLError } from "graphql";
import { AuthPayload, UpdateArgs } from "../../types/types.js";
import { AppDataSource } from "../config/dbConfig.js";
import { ERROR_MESSAGES } from "../constants/messages.js";
import { Users } from "../entities/Users.js";
import bcrypt from 'bcrypt'
async function updateUserDetails(args:UpdateArgs,user:AuthPayload) {

  const userRepo = AppDataSource.getRepository(Users)
  try{
     const {
      username,
      email,
      password,
      profile_image_path,
      collegeName
    } = args.input
    const updateUser = await userRepo.findOne({
      where:{
        userId:user.user_id
      }
    })
    if(!updateUser) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND)

     let password_hash = updateUser.passwordHash;

if (password) {
  const isStrongPassword =
     password.length >= 4 &&
  password.trim() === password &&
  password.trim().length > 0;

  if (!isStrongPassword) {
    throw new Error(
     ERROR_MESSAGES.PASSWORD_NOT_VALID
    );
  }

  password_hash = await bcrypt.hash(password, 10);
}
updateUser.passwordHash =password_hash
  if (username) {
  updateUser.username = username;
}

if (email) {
  updateUser.email = email;
}

if (profile_image_path) {
  updateUser.profile_image_path = profile_image_path;
}

if (collegeName) {
  updateUser.collegeName = collegeName;
}
    await userRepo.save(updateUser);

    return {message: `${updateUser.username} details has been updated`}
    


  }catch(err){
return {message:err}
  }
  
}

async function fetchUserProfile(userId:string){
  const userRepo = AppDataSource.getRepository(Users)
  const userProfile = userRepo.findOne({where:{
    userId:userId,
  },
relations:{
  role:true,
  courses:true,
  results:{quiz:true},
  
}})

if(!userProfile) throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND)
  
  return userProfile;
}

export {updateUserDetails,fetchUserProfile}