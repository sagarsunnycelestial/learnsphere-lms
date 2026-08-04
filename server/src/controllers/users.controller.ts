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
    
      const password_hash = await bcrypt.hash(password,10)
    updateUser.username = username
    updateUser.email = email
    updateUser.profile_image_path = profile_image_path
    updateUser.passwordHash = password_hash
    updateUser.collegeName = collegeName

    await userRepo.save(updateUser);

    return {message: `${updateUser.username} details has been updated`}
    


  }catch(err){
return {message:err}
  }
  
}
export {updateUserDetails}