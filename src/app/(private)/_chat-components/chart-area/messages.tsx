import { MessageType } from '@/interfaces';
import { ChatState, SetChats } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import { getChatMessages, ReadAllMessages } from '@/server-actions/message';
import { message } from 'antd';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from './message';
import socket from '@/config/socket-config';

function Messages() {
  const [messages, setMessages] = React.useState<MessageType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  const { currentUserData }: UserState = useSelector((state: any) => state.user);
  const { selectedChat,chats }: ChatState = useSelector((state: any) => state.chat)
  const MessagesDivRef=React.useRef<HTMLDivElement>(null);

  const getMessages = async () => {
    try {
      setLoading(true);
      const response = await getChatMessages(selectedChat?._id!);
      console.log(response)
      if (response.error) {
        throw new Error(response.error);
      }
      setMessages(response);
    } catch (error: any) {
      message.error(error.message);
    }
  }
  React.useEffect(() => {
    getMessages();
  }, [selectedChat])







  React.useEffect(() => {
    socket.on('received-new-message', (message: MessageType) => {
      if (selectedChat?._id === message.chat._id) {
        setMessages((prev) => {
          const isMessageAlreadyExist= prev.find((msg)=>msg.socketMessageId===message.socketMessageId);
          if(isMessageAlreadyExist){
            return prev;
          }
          else{
            return [...prev, message];
          
          }
        }
        );
      }
    });

    socket.on(
      "user-read-all-chat-messages",
      ({ chatId, readByUserId }: { chatId: string; readByUserId: string }) => {
        if (selectedChat?._id === chatId) {
          setMessages((prev) => {
            const newMessages = prev.map((msg) => {
              if (
                msg.sender._id !== readByUserId &&
                !msg.readBy.includes(readByUserId)
              ) {
                return { ...msg, readBy: [...msg.readBy, readByUserId] };
              }
              return msg;
            });

            return newMessages;
          });
        }
      }
    );

  }
    , [selectedChat]);

    React.useEffect(()=>{
      if(MessagesDivRef.current){
        MessagesDivRef.current.scrollTop=MessagesDivRef.current.scrollHeight+100;
      }


      let unreadMessages = 0;
    let chat = chats.find((chat) => chat._id === selectedChat?._id);
    if (chat && chat.unreadCount) {
      unreadMessages = chat?.unreadCount[currentUserData?._id!] || 0;
    }

    if (unreadMessages > 0) {
      ReadAllMessages({
        userId: currentUserData?._id!,
        chatId: selectedChat?._id!,
      });
      socket.emit("read-all-messages", {
        chatId: selectedChat?._id!,
        readByUserId: currentUserData?._id!,
        users: selectedChat?.users
          .filter((user) => user._id !== currentUserData?._id!)
          .map((user) => user._id),
      });
    }
  
      const newChats=chats.map((chat)=>{
        if(chat._id===selectedChat?._id){
          let chatData={...chat};
          chatData.unreadCount={...chat.unreadCount};
          chatData.unreadCount[currentUserData?._id!]=0;
          return chatData;
        }
        else{
          return chat;
        }
      }
      );
      dispatch(SetChats(newChats));
    },[messages])


  return (
    <div className='flex-1 p-3 md:overflow-y-scroll' ref={MessagesDivRef}>
      <div className='flex flex-col gap-3'>
        {messages.map((message) => {
          return (<Message key={message._id} message={message} />)
        })}
      </div>
    </div>
  )
}

export default Messages