import { UserType } from '@/interfaces';
import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({ 
  name: 'user',
  initialState: {
    currentUserData: null,
    currentUserid: "",
    onlineUsers: [],
  },
    reducers: {
      setCurrentUser: (state, action) => {
        state.currentUserData = action.payload;
      },
      setCurrentUserId: (state, action) => {
        state.currentUserid = action.payload;
      },
      setOnlineUsers: (state, action) => {
        state.onlineUsers = action.payload;
      },
    },

});

export const { setCurrentUser, setCurrentUserId,setOnlineUsers } = userSlice.actions;
export default userSlice;

export interface UserState {
    currentUserData: UserType | null;
    currentUserid: string;
    onlineUsers: string[];}