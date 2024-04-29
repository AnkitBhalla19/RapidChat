import { UserType } from '@/interfaces';
import { ChatState, SetChats } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import { createChat } from '@/server-actions/chats';
import { getAllUsers } from '@/server-actions/user';
import { Button, Divider, message, Modal, Spin } from 'antd'
import { set } from 'mongoose';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

function NewChatModal({
  showNewModal,
  setShowNewModal
}:{
    showNewModal: boolean,
    setShowNewModal: React.Dispatch<React.SetStateAction<boolean>>}
) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const[users, setUsers]=React.useState<UserType[]>([]);
  const {currentUserData} : UserState=useSelector((state:any)=>state.user);
  const[selectedUserId, setSelectedUserId]=React.useState<string|null>(null);
  const {chats}:ChatState=useSelector((state:any)=>state.chat);
  const dispatch=useDispatch();


  const getUsers = async () => {
    try {
      setLoading(true);
      const response= await getAllUsers();
      if(response.error){
        throw new Error(response.error);
      }
      else{
        setUsers(response);
      }
      
    } catch (error: any) {
      message.error(error.message);
    }
    finally{
      setLoading(false);
    }
  }
  React.useEffect(()=>{
    getUsers();
  },[])

  const onAddToChat = async (userId:string) => {
    try{
      setSelectedUserId(userId);
      setLoading(true);
      const response= await createChat({
        users:[currentUserData?._id, userId],
        createdBy: currentUserData?._id,
        isGroupChat: false
      });
      if(response.error){
        throw new Error(response.error);
      }
      else{
        message.success('Chat Created');
        dispatch(SetChats(response));
        setShowNewModal(false);
      }
    }
    catch(error:any){
      message.error(error.message);
    }
    finally{
      setLoading(false);
    }
  }


  return (
    <Modal 
    open={showNewModal}
    onCancel={()=>setShowNewModal(false)}
    footer={null}
    >
        <div className='flex flex-col '>
            <h1 className='text-primary text-xl font-bold text-center uppercase'>
                Create New Chat
            </h1>
            {loading&& !selectedUserId
            && <div className='flex justify-center items-center'>
                <Spin />
                </div>
            }
            {!loading && users.length>0 &&(
            <div className='flex flex-col gap-5'>
            {users.map((user)=>{
              const chatAlreadyExists = chats?.find((chat)=>chat.users.find((u)=>u._id===user._id)
              && !chat.isGroupChat
            );
              if(user._id===currentUserData?._id || chatAlreadyExists){
                return null;
              }
               return (
                <>
                <div key={user._id} className='flex items-center justify-between'>
                <div className='flex gap-5 items-center'>
                    <img src={user.profilePicture} alt={user.name} className='w-10 h-10 rounded-full'/>
                    <span className='text-black font-bold'>{user.userName}</span>
                </div>
                <Button type='primary'
                loading={selectedUserId===user._id && loading}
                onClick={()=>onAddToChat(user._id)}
                > Add To Chat</Button>
                
                </div>
                {/* <Divider className='border-primary my-[1px]' /> */}
                </>
                )}
            )}
              </div>
            )}


        </div>

    </Modal>
  )
}

export default NewChatModal