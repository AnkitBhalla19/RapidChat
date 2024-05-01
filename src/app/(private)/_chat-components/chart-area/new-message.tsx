import { Button, message } from 'antd'
import React, { useEffect } from 'react'
import { SendOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { UserState } from '@/redux/userSlice';
import { ChatState } from '@/redux/chatSlice';
import { sendMessage } from '@/server-actions/message';
import socket from '@/config/socket-config';
import dayjs from 'dayjs';
import EmojiPicker from 'emoji-picker-react';
import ImageSelector from './image-selector';
import { uploadImageToFirebaseAndReturnURL } from '@/helpers/image-upload';
import { set } from 'mongoose';

function NewMessage() {
  const [text, setText] = React.useState<string>('');
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const [showEmojiPicker, setShowEmojiPicker] = React.useState<boolean>(false);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const [showImageSelector, setShowImageSelector] =
    React.useState<boolean>(false);
  const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(
    null
  );
  const[loading,setLoading]=React.useState<boolean>(false);
  const onSend = async () => {
    try {
      if (!text && !selectedImageFile) {
        return;
      }
      setLoading(true);
      let image = '';
      if(selectedImageFile){
        image=await uploadImageToFirebaseAndReturnURL(selectedImageFile);
      }


      const commonPayload = {
        text, image,
        socketMessageId: dayjs().unix(),
        readBy:[]
      }

      const socketPayload = {
        ...commonPayload,
        chat: selectedChat,
        sender: currentUserData,
      };
      socket.emit('send-new-message', socketPayload);
      setText('');

      setSelectedImageFile(null);
      setShowImageSelector(false);
      setShowEmojiPicker(false);
      const dbPayload = {
        ...commonPayload,
        chat: selectedChat?._id!,
        sender: currentUserData?._id!,
      }
      await sendMessage(dbPayload);
    } catch (error: any) {
      message.error(error.message)

    }
    finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    socket.emit('typing', {
      chat: selectedChat,
      senderId: currentUserData?._id!,
      senderName: currentUserData?.name.split(' ')[0]
    });

  }, [selectedChat, text])



  return (
    <div className='p-3 bg-gray-100 border-0 border-t border-gray-300 border-solid flex gap-5 relative'>
      <div className='flex gap-5'>
        <Button
          className="border-gray-300"
          type="text"
          onClick={() => setShowImageSelector(!showImageSelector)}
        >
          <i className="ri-folder-image-line"></i>
        </Button>
        {showEmojiPicker && (
          <div className="absolute left-5 bottom-20">
            <EmojiPicker
              height={350}
              onEmojiClick={(emojiObject: any) => {
                setText((prevText) => prevText + emojiObject.emoji);
              }}
            />
          </div>
        )}
        <Button
          className="border-gray-300"
          type="text"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          {!showEmojiPicker ? (
            <i className="ri-emoji-sticker-line"></i>
          ) : (
            <i className="ri-keyboard-line"></i>
          )}
        </Button>
      </div>
      <input type="text" value={text}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSend();
          }
        }}
        onChange={(e) => setText(e.target.value)} className='w-full border-0 border-b border-solid border-gray-300 px-5 py-3 bg-gray-200' placeholder='Type a message' />
      <Button type='primary'
        onClick={onSend}><SendOutlined /></Button>
      <div>
      {showImageSelector && (
        <ImageSelector
          setShowImageSelector={setShowImageSelector}
          showImageSelector={showImageSelector}
          setSelectedImageFile={setSelectedImageFile}
          selectedImageFile={selectedImageFile}
          onSend={onSend}
          loading={loading}
        />
      )}

      </div>
    </div>
  )
}

export default NewMessage;