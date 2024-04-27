'use client'
import { uploadImageToFirebaseAndReturnURL } from '@/helpers/image-upload';
import { UserType } from '@/interfaces'
import { UserState } from '@/redux/userSlice'
import { createChat, UpdateChat } from '@/server-actions/chats';
import { Button, Form, Input, message, Upload } from 'antd';
import React from 'react'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

function GroupForm(
    {users,initialData=null}:{users:UserType[],
    initialData?:any
    }
) {
    const router = useRouter();
    const{currentUserData}:UserState = useSelector((state:any)=>state.user);

    const [loading, setLoading] = React.useState(false);
    const [selectedProfilePicture, setSelectedProfilePicture] =React.useState<File>();
    const [selectedUserIds = [], setSelectedUserIds] = React.useState<string[]>(
      initialData?.users.filter(
        (userId: string) => userId !== currentUserData?._id!
      ) || []
    );

    const onFinish = async (values:any) => {
        try {
            setLoading(true);
            const payload = {
                groupName: values.groupName,
                groupBio: values.groupDescription,
                groupProfilePicture:initialData?.groupProfilePicture||'',
                users:[...selectedUserIds, currentUserData?._id],
                createdBy:currentUserData?._id,
                isGroupChat:true,}
                if(selectedProfilePicture){
                    const url= await uploadImageToFirebaseAndReturnURL(selectedProfilePicture);
                    payload.groupProfilePicture=url;
                }
                let response: any = null;
                if (initialData) {
                  response = await UpdateChat({
                    chatId: initialData._id,
                    payload: payload,
                  });
                } else {
                  response = await createChat(payload);
                }
                if (response.error) throw new Error(response.error);
                message.success(
                  initialData
                    ? "Group updated successfully"
                    : "Group created successfully"
                );
                router.refresh();
                router.push('/');
        } catch (error:any) {
            return message.error(error.message);
        }
        finally{
            setLoading(false);
        }
    };


  return (
    <div className='grid grid-cols-2'>
        <div className="flex flex-col gap-5">
        <span className="text-gray-500 text-xs">
          Select users to add to group
        </span>
            {users.map((user)=>{
                if(user._id===currentUserData?._id){
                    return null;
                }
            return (
                <div key={user._id} className='flex gap-4 items-center'>
                    <input type="checkbox"  checked={selectedUserIds.includes(user._id)} 
                    onChange={() => {
                      if (selectedUserIds.includes(user._id)) {
                        setSelectedUserIds(
                          selectedUserIds.filter((id) => id !== user._id)
                        );
                      } else {
                        setSelectedUserIds([...selectedUserIds, user._id]);
                      }
                    }}/>
                    <img src={user.profilePicture} className='w-10 h-10 rounded-full' />
                    <div>{user.name}</div>
                </div>
            )})}
        </div>
        <div>
        <Form layout="vertical" onFinish={onFinish} initialValues={initialData}>
          <Form.Item
            name="groupName"
            label="Group Name"
            rules={[{ required: true, message: "Please input group name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="groupDescription" label="Group Description">
            <Input.TextArea />
          </Form.Item>

          <Upload
            beforeUpload={(file) => {
              setSelectedProfilePicture(file);
              return false;
            }}
            maxCount={1}
            listType="picture-card"
          >
            <span className="p-3 text-xs">Upload Group Picture</span>
          </Upload>

          <div className="flex justify-end gap-5">
            <Button className='bg-yellow-500 text-primary font-bold antd-cancel' 
            onClick={() => {router.push('/')}}
            
            >
              Cancel
            </Button>
            <Button className='bg-primary text-yellow-500 font-bold antd-group-button'
            type="primary" htmlType="submit" loading={loading}>
                {initialData ? "Update Group" : "Create Group"}
            </Button>
          </div>
        </Form>
            
            
        </div>    
    </div>
  )
}

export default GroupForm