import React from 'react'
import ChatHeader from './chat-header';
import ChatList from './chat-list';

function Chat() {
  return (
    <div className="w-full md:w-[325px] lg:w-[400px] h-full p-3" id='home'>
      <ChatHeader />
      <ChatList />
    </div>
  )
}

export default Chat;