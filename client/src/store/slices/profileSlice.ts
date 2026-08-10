import { createSlice } from "@reduxjs/toolkit";

interface ProfileProps {
  viewType:'card' | 'list',
  searchQuery:string,
  currentTab: string,
  page:number,
  totalEnrolled:number
}

const initialState:ProfileProps = {
  viewType:'card',
  searchQuery:'',
  currentTab:'1',
  page:1,
  totalEnrolled:0
}

const profileSlice= createSlice({
  name:'profile',
  initialState,
  reducers:{
    changeView(state,action){
      state.viewType=action.payload;
    },
    searchQ(state,action){
      state.searchQuery=action.payload
      state.searchQuery=action.payload
    },
    changeTab(state,action){
      state.currentTab=action.payload
    },
    changePage(state,action){
      state.page =action.payload
    },
    countEmps(state,action){
      state.totalEnrolled =action.payload
    }
  }
})

export const  {changeView,searchQ,changeTab,changePage,countEmps} = profileSlice.actions;
export default profileSlice.reducer;