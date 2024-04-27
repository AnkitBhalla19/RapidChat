import { dateFormat } from '@/helpers/date-format';
import { ChatType } from '@/interfaces'
import { ChatState, setSelectedChat } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

function ChatCard(
    {chat}:{chat:ChatType}
) {
    
    const dispatch=useDispatch();

    const {currentUserData,onlineUsers}:UserState=useSelector((state:any)=>state.user)
    let chatName='';
    let chatImage='';
    let lastMessage='';
    let lastMessageSenderName='';
    let lastMessageTime='';

    if(chat.LastMessage){
        lastMessage=chat.LastMessage.text;
        lastMessageSenderName=chat?.LastMessage?.sender?._id===currentUserData?._id? "You:" :`${chat.LastMessage.sender?.name.split(' ')[0]}:`
        lastMessageTime=dateFormat(chat.LastMessage.createdAt)
    }

    if(chat.isGroupChat){
        chatName=chat.groupName
        chatImage=chat.groupProfilePicture
    }else{
        const receipient=chat.users.find((user)=>user._id!==currentUserData?._id)
        chatName=receipient?.name!;
        chatImage=receipient?.profilePicture!;
    }
    

    const {selectedChat}:ChatState =useSelector((state:any)=>state.chat);

    const isSelected=selectedChat?._id===chat._id;
    const unreadCount=()=>{
      if(!chat.unreadCount || !chat?.unreadCount[currentUserData?._id!] || chat._id === selectedChat?._id){
        return null;
    }
    return (
        <div className='bg-yellow-500 rounded-full flex justify-center items-center h-5 w-5'>
            <span className='text-xs text-black font-bold   '>
                {chat.unreadCount[currentUserData?._id!]}
            </span>
        </div>
    )
}

const onlineIndicator = () => {
    if (chat.isGroupChat) return null;
    const recipientId = chat.users.find(
      (user) => user._id !== currentUserData?._id
    )?._id;
    if (onlineUsers.includes(recipientId!)) {
      return <div className="w-2 h-2 rounded-full bg-green-700"></div>;
    }
  };



  return (
    <div className={`flex justify-between hover:bg-gray-200 py-2 px-2 rounded cursor-pointer ${isSelected ? "bg-gray-200":""}`}
    onClick={()=>dispatch(setSelectedChat(chat))} >
        <div className='flex gap-5 items-center'>
            <img src={chatImage} alt="" className='w-12 h-12 rounded-full'/>
            <div className='flex flex-col gap-1'>
            <span className='font-semibold flex gap-2 items-center'
            >{chatName}{onlineIndicator()}</span>
            <span>{lastMessageSenderName} {lastMessage}</span>

            </div>
        </div>
        <div>
            {unreadCount()}
            <span className='text-xs text-gray-500'>{lastMessageTime}</span>
        </div>
    </div>
  )
}

export default ChatCard