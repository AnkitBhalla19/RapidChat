import React from 'react'
import ChatHeader from './chat-header';
import ChatList from './chat-list';

function Chat() {
  return (
    <div className="w-[400px] h-full p-3">
      <ChatHeader />
      <ChatList />
    </div>
  )
}

export default Chat;