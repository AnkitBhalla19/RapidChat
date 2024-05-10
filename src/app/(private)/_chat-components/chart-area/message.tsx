import { MessageType } from '@/interfaces'
import { ChatState } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import React from 'react'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { dateFormat } from '@/helpers/date-format'

function Message(
    {message}:
    {message:MessageType}
) {
    const {selectedChat}:ChatState=useSelector((state:any)=>state.chat)
    const{currentUserData}:UserState=useSelector((state:any)=>state.user)

    const isLoggedUser=message?.sender?._id===currentUserData?._id;
    let read=false;
    if (
        selectedChat &&
        selectedChat?.users?.length - 1 === message.readBy.length
      ) {
        read = true;
      }

    if(isLoggedUser){
        return (
            <div className='flex justify-end gap-2'>
                <div className='flex flex-col gap-2'>
                {message.text &&<p className='bg-primary text-white px-7 py-2 rounded-xl rounded-tl-none m-0'>
                    {message.text}
                </p>}
                {message.gifUrl && (
                        <img src={message.gifUrl} className='h-40 w-50 rounded-lg rounded-tr-none z-0' alt='message-gif' />
                    )}
                {message.image && <img src={message.image} alt='message' className='w-60 h-60 rounded-xl rounded-tl-none'></img>}
                <div className="flex justify-between">

                <span className='text-xs text-gray-500'>
                    {dateFormat(message.createdAt)}
                </span>
                <i
              className={`ri-check-double-line ${
                read ? "text-green-500" : "text-gray-400"
              }`}
                ></i>
                </div>
                </div>
                <img src={message.sender.profilePicture} alt='Avtar' className='w-8 h-8 rounded-full'
                 ></img>
            </div>
        )
    }
    else{
        return (
            <div className='flex gap-2'>
                <img src={message.sender.profilePicture} alt='Avtar' className='w-8 h-8 rounded-full'
                 ></img>
                <div className='flex flex-col gap-2'>
                    <span className='text-bold text-black'>
                        {message.sender.name}
                    </span>
                {message.text && <p className= 'bg-yellow-500/50 text-black rounded-xl rounded-tr-none m-0 px-7 py-2 text-sm font-medium'>
                    {message.text}
                </p> }
                {message.gifUrl && (
                        <img src={message.gifUrl} className='h-40 w-50 rounded-lg rounded-tr-none z-0' alt='message-gif' />
                    )}
                {message.image && <img src={message.image} alt='message' className='w-60 h-60 rounded-xl rounded-tr-none'></img>}
                <span className='text-xs text-gray-500'>
                {dateFormat(message.createdAt)}
                    
                </span>
                </div>
                
            </div>
        )

    }
}

export default Message