import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  profilePhoto : "",
  id : "",
  role : "",
  email :"" ,
  bio : ""
}


export const userSlice = createSlice({
  name : 'user',
  initialState,
  reducers : {
    setUser : (state , action)=>{
      state.username = action.payload.name;
      state.profilePhoto = action.payload.profilePhoto;
      state.id = action.payload._id;
      state.role = action.payload.role
      state.bio = action.payload.bio
      state.email = action.payload.email
      localStorage.setItem('user', JSON.stringify(state))
    },
    getUser : (state)=>{
      const user = JSON.parse(localStorage.getItem('user'))
      if(user){
        state.username = user.username;
        state.profilePhoto = user.profilePhoto;
        state.id = user.id;
        state.role = user.role;
        state.bio = user.bio;
        state.email = user.email;

      } 
    },
    logUserOut : (state)=>{
      localStorage.removeItem("user")
      state.username = "";
      state.profilePhoto = "";
      state.id = "";
      state.role = "";
      state.bio = "";
      state.email = "";
    }
  }
})

export const {setUser , getUser , logUserOut} = userSlice.actions
export default userSlice.reducer

