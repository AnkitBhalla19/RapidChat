
import { ChatState } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import { sendMessage } from '@/server-actions/message';
import { Image } from '@nextui-org/react';
import { Input,Button, message } from 'antd'
import dayjs from 'dayjs';
import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import ImageSelector from './image-selector';
import { uploadImageToFirebaseAndReturnURL } from '@/helpers/image-upload';
import socket from '@/config/socket-config';
import { SendOutlined } from '@ant-design/icons';
import { CloseOutlined } from '@ant-design/icons';

function NewMessage() {

  const [text, setText] = React.useState('');
  const [gifUrl, setGifUrl] = React.useState('');

  const {currentUserData}: UserState = useSelector((state: any) => state.user);
  const {selectedChat}: ChatState = useSelector((state: any) => state.chat);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState<boolean>(false);
  const [showGifPicker, setShowGifPicker] = React.useState<boolean>(false);
  const [showImageSelector, setShowImageSelector] = React.useState<boolean>(false);
  const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const gifPickerRef = useRef<HTMLDivElement>(null);

  const onSend = async () => {
    try {
      if(!text && !selectedImageFile && !gifUrl){
        return;
      }

      setLoading(true);

      let image = "";
      if (selectedImageFile) {
        image = await uploadImageToFirebaseAndReturnURL(selectedImageFile);
      }

      
      const socketPayload = {
        text,
        image,
        gifUrl,
        socketMessageId: dayjs().unix(),
        sender: currentUserData,
        chat: selectedChat,
        readBy: [],
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString()
      };

      socket.emit("send-new-message",socketPayload);

      const dbPayload = {
        text,
        image,
        gifUrl,
        socketMessageId: dayjs().unix(),
        sender: currentUserData?._id!,
        chat: selectedChat?._id!,
        readBy: [],
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString()
      };

      await sendMessage(dbPayload);

      // console.log(response.data);
      setText('');
      setGifUrl('');
      setShowEmojiPicker(false);
      setShowGifPicker(false);
      setSelectedImageFile(null);
      setShowImageSelector(false);
    } catch (error:any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> {
    setText('');
    setGifUrl('');
    setShowEmojiPicker(false);
    setShowGifPicker(false);
    setSelectedImageFile(null);
    setShowImageSelector(false);
  },[selectedChat])

  useEffect(()=> {
      socket.emit("typing", {chat: selectedChat, senderId: currentUserData?._id!, senderName: currentUserData?.name});
  },[selectedChat,text,gifUrl]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }

      if (
        gifPickerRef.current &&
        !gifPickerRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowGifPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className='p-3 bg-gray-100 border-t border-solid border-gray-400 flex gap-2 md:gap-5 items-center relative' id='newMessage'>
      <div className='flex gap-1 md:gap-3'>
          {showEmojiPicker && 
            <div className='md:absolute md:left-14 md:bottom-20 z-[100] absolute left-1 bottom-20' ref={emojiPickerRef}>
              <EmojiPicker
                height={400}
                onEmojiClick={(emojiObject: any) => {
                  setText((prevText) => prevText + emojiObject.emoji);
                  inputRef.current?.focus();
                }}
              />
            </div>
          }

          {showGifPicker && 
            <div className='md:absolute md:left-14 md:bottom-20 z-[100] absolute left-1 bottom-20' ref={gifPickerRef}>
              <GifPicker
                tenorApiKey='AIzaSyDtW2rt98gchBHm9n2ifG30Beku0AiBq3E'
                height={400}
                onGifClick={(gifObject: any) => {
                  setGifUrl(gifObject.url);
                  setShowGifPicker(false);
                  inputRef.current?.focus();
                }}
              />
            </div>
          }

        {/* Image Selector */}
        <Button className="border border-solid border-primary bg-white" onClick={() => {
          setShowImageSelector(!showImageSelector);
          setShowEmojiPicker(false);
          setShowGifPicker(false);
        }}>
          <i className="ri-folder-image-line"></i>
        </Button>

        {/* Emoji Picker */}
        <Button className='border border-solid border-primary bg-white' onClick={()=>{
          setShowEmojiPicker(!showEmojiPicker);
          setShowGifPicker(false);
        }}>
          {!showEmojiPicker ? (
            <i className="ri-emoji-sticker-line"></i>
          ) : (
            <i className="ri-keyboard-line"></i>
          )}
        </Button>

        {/* Gif Picker */}
        <Button className='border border-solid border-primary bg-white' onClick={()=>{
          setShowGifPicker(!showGifPicker);
          setShowEmojiPicker(false);
        }}>
          {!showGifPicker ? (
            <i className="ri-file-gif-line"></i>
          ) : (
            <i className="ri-keyboard-line"></i>
          )}
        </Button>

      </div>

      <div className='flex-1'>
        {!gifUrl && (
          <input placeholder='Type a message' 
            className='w-full h-[40px] md:h-[50px] px-3 border border-solid border-gray-300 outline-none focus:outline-none focus:border-primary'
            value={text}
            onChange={(e) => setText(e.target.value)} 
            onKeyDown={(e) => {
              if(e.key === 'Enter') {
                onSend();
              }
            }}
            ref={inputRef}
          /> 
        )}
        {gifUrl && 
          <div className="flex items-center justify-between">
            <Image src={gifUrl} alt="" className="w-full h-[50px]" />
            <Button
              type='primary'
              onClick={() => setGifUrl("")}
              className='flex items-center justify-center'
            >
              <CloseOutlined />
            </Button>
          </div>
        }
      </div>

      <Button onClick={onSend} type='primary' className='flex justify-center items-center'>
      <SendOutlined />
      </Button>
      
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
  )
}

export default NewMessage