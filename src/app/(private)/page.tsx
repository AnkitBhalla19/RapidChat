'use client';
import { Divider, message } from "antd";
import ChatArea from "./_chat-components/chart-area";
import Chat from "./_chat-components/chats";
import React, { useState, useEffect } from 'react';
import { ChatState, SetChats } from "@/redux/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { getChatMessages, ReadAllMessages } from "@/server-actions/message";
import { MessageType } from "@/interfaces";
import socket from "@/config/socket-config";


export default async function Home() {

  const [showChatArea, setShowChatArea] = useState(false);
  const { selectedChat,chats }: ChatState = useSelector((state: any) => state.chat);
  const {currentUserData} = useSelector((state: any) => state.user);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const chatAreaRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useDispatch(); 

  useEffect(() => {
    const breakpoint = 768;

    const handleResize = () => {
      setShowChatArea(window.innerWidth >= breakpoint);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getMessages = async () => {
    try {
      const response  = await getChatMessages(selectedChat?._id!);

      if (response.error) {
        throw new Error(response.error);
      }
      setMessages(response);
    } catch (error: any) {
      message.error(error.message);
    }
  };


  useEffect(() => {
    getMessages();
  }, [selectedChat]);


  useEffect(() => {
    socket.on("new-message-received", (message: MessageType) => {
      if(selectedChat?._id === message.chat._id){
        setMessages((prev) => {
          const isMessageAlreadyExists: any = prev.find((msg) => msg.socketMessageId === message.socketMessageId);
          if (isMessageAlreadyExists) return prev;
          else return [...prev, message];
        });
      }
    });


    // listen for user-read-all-chat-messages event
    socket.on("user-read-all-chat-messages",({ chatId, readByUserId }: { chatId: string; readByUserId: string }) => {
        if (selectedChat?._id === chatId) {
          setMessages((prev) => {
            const newMessages = prev.map((msg) => {
              if (msg.sender._id !== readByUserId && !msg.readBy.includes(readByUserId)) {
                return { ...msg, readBy: [...msg.readBy, readByUserId] };
              }
              return msg;
            });

            return newMessages;
          });
        }
    });
    
  }, [selectedChat]);


  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight + 100;
    }

    // clear unread messages

    let unreadMessages = 0;
    let chat = chats.find((chat) => chat._id === selectedChat?._id);
    if (chat && chat.unreadCount) {
      unreadMessages = chat?.unreadCount[currentUserData?._id!] || 0;
    }

    if(unreadMessages > 0){
      ReadAllMessages({chatId: selectedChat?._id!, userId: currentUserData?._id!});

      socket.emit("read-all-messages", {
        chatId: selectedChat?._id!, 
        userId: currentUserData?._id!,
        users: selectedChat?.users.filter((user) => user._id !== currentUserData?._id!).map((user) => user._id),
      });

    }

    //set the unread messages to 0 for the selected chat
    const newChats = chats.map((chat) => {
      if(chat._id === selectedChat?._id){
        let chatData = {...chat};
        chatData.unreadCount = {...chat.unreadCount};
        chatData.unreadCount[currentUserData?._id!] = 0;
        return chatData;
      }
      return chat;
    });

    dispatch(SetChats(newChats));
  }, [messages]);

  return (
  
    <div className="flex h-screen md:h-[calc(100vh-65px)] flex-col md:flex-row" >
      {!showChatArea && !selectedChat && (
        <div className="h-full overflow-y-auto custom-scrollbar">
          <Chat />
        </div>
      )}
      {!showChatArea && selectedChat && (
        <div className="overflow-y-scroll mt-[129px] mb-[65px]" ref={chatAreaRef}>
          <ChatArea />
        </div>
      )}
      {showChatArea && (
        <>
          <div className="h-full overflow-y-auto custom-scrollbar">
            <Chat />
          </div>
          <Divider type="vertical" className="h-full border-yellow-500 px-0 mx-0"/>
          <ChatArea />
        </>
      )}
    </div>
    
  );
}
