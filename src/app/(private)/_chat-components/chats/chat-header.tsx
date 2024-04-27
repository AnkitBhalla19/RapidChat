import { Button, Dropdown, MenuProps, Space } from "antd";
import React from 'react'
import NewChatModal from './new-chat-modal';
import { useRouter } from 'next/navigation';
import { DownOutlined } from '@ant-design/icons';
// import { Dropdown ,DropdownItem,DropdownMenu,Button,DropdownTrigger} from '@nextui-org/react';

function ChatHeader() {
    const router = useRouter();
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        console.log('click', e);
      };

    const [showNewModal, setShowNewModal] = React.useState(false)
    const items: MenuProps["items"] = [
        {
          label: "New Chat",
          key: "1",
          onClick: () => setShowNewModal(true),
        },
        {
          label: "New Group",
          key: "2",
          onClick: () => router.push("/groups/create-group"),
        },
      ];

      const menuProps = {
        items,
        onClick: handleMenuClick,
      };

  return (
    <div>
    <div className='flex  justify-between items-center'>
        <div className='text-xl font-bold uppercase text-primary'
        >My Chats</div>
            <Dropdown menu={menuProps}>
      <Button className="bg-yellow-500">
        <Space>
          <span className="text-primary font-bold uppercase">New</span>
          <DownOutlined />  
        </Space>
      </Button>
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