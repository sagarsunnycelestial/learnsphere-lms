import { createSlice } from "@reduxjs/toolkit";
import { type FormInitialState,  } from "../../types/types";



const initialState:FormInitialState = {
  users:{
    mode:'add',
isUserAddFormOpen: false,
selectedUser: null
  },
  courses:{
    mode:'add',
isAddCourseFormOpen: false,
selectedcourse:null
  },
  
  
};

const formSlice = createSlice({ 
    name: "form",
    initialState,
    reducers: {
      userAddFormControl(state,action){
        const {mode,isUserAddFormOpen,selectedUser} = action.payload
        state.users.isUserAddFormOpen = isUserAddFormOpen
        state.users.mode = mode
        state.users.selectedUser =selectedUser
      },
      addCourseFormControl(state,action){
        state.courses.isAddCourseFormOpen = action.payload
      }
    } });

    export const {userAddFormControl,addCourseFormControl} = formSlice.actions;
    export default formSlice.reducer;