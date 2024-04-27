import { ChatType } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    selectedChat: null, 
  },
  reducers: {
    SetChats: (state, action) => {
      state.chats=action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat=action.payload;
    },
  },
});

export const { SetChats,setSelectedChat } = chatSlice.actions;
export default chatSlice;

export interface ChatState {
    chats:ChatType[];
    selectedChat:ChatType|null; 
}