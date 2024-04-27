import { ChatState, SetChats } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import { getChats } from '@/server-actions/chats';
import { message, Spin } from 'antd';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChatCard from './chat-card';
import { ChatType, MessageType } from '@/interfaces';
import store from '@/redux/store';
import socket from '@/config/socket-config';

function ChatList() {
  const dispatch = useDispatch();
  const { chats }: ChatState = useSelector((state: any) => state.chat)
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const [loading, setLoading] = React.useState<boolean>(false)

  const getChat = async () => {
    try {
      setLoading(true)
      const response = await getChats(currentUserData?._id!);
      if (response.error) {
        throw new Error(response.error)
      }
      dispatch(SetChats(response));

    } catch (error: any) {
      message.error(error.message)
    }
    finally {
      setLoading(false)
    }
  }
  React.useEffect(() => {
    if (currentUserData) {
      getChat()
    }
  }, [currentUserData])


  React.useEffect(() => {
    socket.on("received-new-message", (newMessage: MessageType) => {
      let { chats }: ChatState = store.getState().chat;
      let prevChats = [...chats];

      let indexOfChatToUpdate = prevChats.findIndex(
        (chat) => chat._id === newMessage.chat._id
      );

      if (indexOfChatToUpdate === -1) return;

      let chatToUpdate = prevChats[indexOfChatToUpdate];

      if (
        chatToUpdate?.LastMessage?.socketMessageId==newMessage.socketMessageId
      )
        return;

      let chatToUpdateCopy: ChatType = { ...chatToUpdate };
      chatToUpdateCopy.LastMessage = newMessage;
      chatToUpdateCopy.updatedAt = newMessage.createdAt;
      chatToUpdateCopy.unreadCount = { ...chatToUpdateCopy.unreadCount };



      if (
        newMessage.sender._id !== currentUserData?._id &&
        selectedChat?._id !== newMessage.chat._id
      ) {
        chatToUpdateCopy.unreadCount[currentUserData?._id!] =
          (chatToUpdateCopy.unreadCount[currentUserData?._id!] || 0) + 1;
      }
      prevChats[indexOfChatToUpdate] = chatToUpdateCopy;


      prevChats = [
        prevChats[indexOfChatToUpdate],
        ...prevChats.filter((chat) => chat._id !== newMessage.chat._id),
      ];
      dispatch(SetChats(prevChats));
    });
  }, [selectedChat]);





  return (
    <div>
      {chats.length > 0 && (
        <div className='flex flex-col gap-3 mt-5'>
          {chats.map((chat) => {
            return <ChatCard chat={chat} key={chat._id} />;
          })}
        </div>
      )}
      {loading && <div className='flex mt-32 justify-center items-center'>
        <div className='flex flex-col'>

          <Spin />
          <span className='ml-3'>Loading Chats...</span>
        </div>
      </div>
      }
    </div>
  )
}

export default ChatList