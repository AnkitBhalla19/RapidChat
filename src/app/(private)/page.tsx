'use client';
import { Divider } from "antd";
import ChatArea from "./_chat-components/chart-area";
import Chat from "./_chat-components/chats";
import Head from "next/head";


export default async function Home() {

  return (
  
    <div className="flex h-[87vh]" >
      <div className="h-full overflow-y-auto">
      <Chat />
      </div>
      <Divider type="vertical" className="h-full border-yellow-500 px-0 mx-0"
       />
      <ChatArea />
      
    </div>
    
  );
}
