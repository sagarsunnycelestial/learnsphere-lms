
import { createSlice } from "@reduxjs/toolkit";
import {UserRoles,type AuthInitialState} from '../../types/types'
import { loginThunk } from "../thunks/loginThunk";
import { toast } from "react-toastify";

const initialState:AuthInitialState = {
  status:'idle',
  user:{
accessToken:null,
  role:UserRoles.STUDENT,
  isAuthenticated:false,
  profile_image_path:null,
  },
  error:null 
}

const authSlice = createSlice({
  name:'auth',
  initialState,
  reducers:{

    logout(state){
      state.user.accessToken = '';
      state.user.role =UserRoles.STUDENT;
      state.user.profile_image_path =null
    },
    refreshUser(state,action){
      state.status='succeeded';
      state.user = action.payload
    }
  },
   extraReducers:(builder)=>{
    builder.
    addCase(loginThunk.pending,(state)=>{
      state.status='loading'
      state.error=null
    })
    .addCase(loginThunk.fulfilled,(state,action)=>{
      state.user =action.payload
      state.status = 'succeeded'
    })
    .addCase(loginThunk.rejected,(state,action)=>{
      state.error= action.payload as {message:string} ?? null
      console.log(state.error)
      toast.error(state.error.message)
    })
  }
})
export const {logout,refreshUser} = authSlice.actions
export default authSlice.reducer