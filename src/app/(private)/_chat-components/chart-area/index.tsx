import React from 'react'
import Recipient from './recipient'
import { useSelector } from 'react-redux';
import { WechatOutlined } from '@ant-design/icons';
import Messages from './messages';
import NewMessage from './new-message';

function ChatArea() {

  const {selectedChat} = useSelector((state:any)=>state.chat);
  if(!selectedChat){
    return (
      <div className='flex-1 flex flex-col items-center justify-center'>
        <WechatOutlined className='text-9xl text-primary'/>
        <div className='text-center text-2xl text-primary'>Select a chat to start messaging</div>
      </div>
    )
  }


  return (
    selectedChat && (
      <div className='flex-1 flex-col flex justify-between'>  
      <Recipient />
      <Messages/>
      <NewMessage />
    </div>)
  )
}

export default ChatArea