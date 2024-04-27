import { dateFormat } from '@/helpers/date-format';
import { ChatState } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import { Button, Divider, Drawer } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

function RecipientInfo({
    showRecipientInfo,
    setShowRecipientInfo
}: {
    showRecipientInfo: boolean,
    setShowRecipientInfo: React.Dispatch<React.SetStateAction<boolean>>
}


) {
    const router=useRouter();
    const { currentUserData }: UserState = useSelector((state: any) => state.user)
    const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
    let chatName = '';
    let chatImage = '';

    if (selectedChat?.isGroupChat) {
        chatName = selectedChat.groupName
        chatImage = selectedChat.groupProfilePicture
    }
    else {
        const receipient = selectedChat?.users.find((user) => user._id !== currentUserData?._id)
        chatName = receipient?.name!;
        chatImage = receipient?.profilePicture!;

    }

    const getProperty = (key: string, value: string) => {
        return (
            <div className='flex flex-col'>
                <span className='font-bold text-yellow-500'
                >{key}</span>
                <span className='text-white'
                >{value}</span>
            </div>
        )

    }


    return (
        <Drawer style={{ backgroundColor: '#31304D' }}
            onClose={() => setShowRecipientInfo(false)} open={showRecipientInfo}
            title={chatName}
        >
            <div className='flex flex-col items-center gap-5'>
                <img src={chatImage} alt="" className='w-32 h-32 rounded-full' />
                <span className='text-yellow-500 text-lg uppercase font-semibold my-3'
                >{chatName}</span>
            </div>
            {selectedChat?.isGroupChat && (
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <span className="text-yellow-500 text-sm">
              {selectedChat.users.length} Members
            </span>
            <Button
            className='bg-yellow-500 font-bold'
              size="middle"
              onClick={() =>
                router.push(`/groups/edit-group/${selectedChat._id}`)
              }
            >
              Edit Group
            </Button>
          </div>
          {selectedChat.users.map((user) => (
            <div className="flex gap-5 items-center" key={user._id}>
              <img
                src={user.profilePicture}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white text-sm">{user.userName}</span>
            </div>
          ))}
        </div>
      )}
            <Divider 
            className='bg-yellow-500 my-5'></Divider>
            <div className='flex flex-col gap-5'>
                {getProperty('Created On ', dateFormat(selectedChat?.createdAt!))} 
                {getProperty('Created By ', selectedChat?.createdBy?.name!)}
            </div>

        </Drawer>
    )
}

export default RecipientInfo