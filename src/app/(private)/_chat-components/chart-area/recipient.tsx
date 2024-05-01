import { ChatState, setSelectedChat } from '@/redux/chatSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import RecipientInfo from './recipient-info';
import socket from '@/config/socket-config';
import { ChatType } from '@/interfaces';
import { Avatar } from 'antd';

function Recipient() {
    const [showRecipientInfo, setShowRecipientInfo] = useState(false);
    const [typing, setTyping] = useState(false);
    const [senderName = "", setSenderName] = React.useState<string>('');
    const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
    const { currentUserData } = useSelector((state: any) => state.user)
    const dispatch = useDispatch();
    let chatName = '';
    let chatImage = '';

    if (selectedChat?.isGroupChat) {
        chatName = selectedChat.groupName
        chatImage = selectedChat.groupProfilePicture
    } else {
        const receipient = selectedChat?.users.find((user) => user._id !== currentUserData?._id)
        chatName = receipient?.name!;
        chatImage = receipient?.profilePicture!;

    }

    const typingAnimation = () => {
        if (typing) {
            return (<span className='text-green-600 font-semibold'>
                <i className="ri-edit-2-fill"></i>{selectedChat?.isGroupChat && ` ${senderName} is `}
                Typing...
            </span>)
        }
    }

    useEffect(() => {
        socket.on('typing', ({ chat, senderName }: {
            chat: ChatType,
            senderName: string
        }) => {
            if (selectedChat?._id === chat?._id) {
                setTyping(true);
                if (chat.isGroupChat) {
                    setSenderName(senderName)
                }
            }
            setTimeout(() => {
                setTyping(false)
            }, 2000)

        })
        return () => {
            socket.off('typing')
        }
    }, [selectedChat])


    return (
        <div className='flex justify-between border-0 border-b border-yellow-500 py-3 px-5 border-solid bg-gray-100'>
            <div className='flex items-center gap-3'>
            <img src='/back.svg' className='cursor-pointer w-[25px] h-[25px]' onClick={()=>{dispatch(setSelectedChat(null))}}></img> 
            <div className='flex flex-row items-center gap-2 cursor-pointer' onClick={()=>setShowRecipientInfo(true)}>
                <Avatar src={chatImage} alt='' className='w-10 h-10 rounded-full' />
                <div className='flex flex-col gap-1'>
                    <span className='text-primary font-bold uppercase'>{chatName}</span>
                    {typingAnimation()}
                </div>
            </div>
        </div>
            {showRecipientInfo && (
                <RecipientInfo {...{ showRecipientInfo, setShowRecipientInfo }}
                />
            )}

        </div>
    )
}

export default Recipient