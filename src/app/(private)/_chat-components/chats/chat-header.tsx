
import React from 'react'
import NewChatModal from './new-chat-modal';
import { useRouter } from 'next/navigation';
import { Dropdown ,DropdownItem,DropdownMenu,Button,DropdownTrigger} from '@nextui-org/react';

function ChatHeader() {
    const router = useRouter();

    const [showNewModal, setShowNewModal] = React.useState(false)

  return (
    <div>
    <div className='flex  justify-between items-center'>
        <div className='text-xl font-bold uppercase text-gray-500'
        >My Chats</div>
        <Dropdown>
            <DropdownTrigger>
                <Button>
                    New
                </Button>
            </DropdownTrigger>
            <DropdownMenu
            aria-label='Dropdown varient'
            color='primary'
            variant='solid'
            >
                <DropdownItem key="1" onClick={()=>setShowNewModal(true)}>New Chat</DropdownItem>
                <DropdownItem key="2" onClick={()=>router.push('/groups/create-group')}>New Group</DropdownItem>
            </DropdownMenu>

        </Dropdown>
        </div>
        <input type="text" placeholder='Search' className='bg-yellow-500/60 w-full border border-primary border-solid rounded-md px-3 h-14 mt-3 mb-3 outline-none focus:outline-none focus:border-primary text-primary'/>
        {
            showNewModal && <NewChatModal showNewModal={showNewModal} setShowNewModal={setShowNewModal} />
        }

    </div>
  )
}

export default ChatHeader