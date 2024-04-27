
import { UserType } from '@/interfaces'
import { Button, Divider, Drawer, message, Upload } from 'antd'
import React from 'react'
import dayjs from 'dayjs'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { set } from 'mongoose'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentUser, UserState } from '@/redux/userSlice'
import { uploadImageToFirebaseAndReturnURL } from '@/helpers/image-upload'
import { updateUserProfilePicture } from '@/server-actions/user'
import { UploadOutlined } from '@ant-design/icons';
import socket from '@/config/socket-config'

function CurrentUserInfo(
  { showCurrentUserInfo
    , setshowCurrentUserInfo
  }: {
    showCurrentUserInfo: boolean
    setshowCurrentUserInfo: React.Dispatch<React.SetStateAction<boolean>>
  }) {

  const { signOut } = useClerk();
  const { currentUserData }: UserState = useSelector((state: any) => state.user);
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

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
  const onLogOut = async () => {
    try {
      setLoading(true);
      socket.emit('logout', currentUserData?._id);
      setshowCurrentUserInfo(false);
      await signOut();
      message.success('Logged Out Successfully');
      router.push('/sign-in');

    }
    catch (error: any) {

    }
    finally {
      setLoading(false);
    }
  }

  const onProfilePictureUpdate = async () => {
    try {
      setLoading(true);
      const url=await uploadImageToFirebaseAndReturnURL(selectedFile!);
      const response=await updateUserProfilePicture(currentUserData?._id!,{profilePicture:url});
      if(response.error){
        throw new Error(response.error);
      }
      dispatch(setCurrentUser(response));
      message.success('Profile Picture Updated Successfully');
      setshowCurrentUserInfo(false);
    } catch (error: any) {
      message.error(error.message);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <Drawer
      style={{ backgroundColor: '#31304D' }}
      open={showCurrentUserInfo}
      onClose={() => setshowCurrentUserInfo(false)}
      title='Profile'
    >
      {currentUserData && (<div className="flex flex-col gap-5">

        <div className='justify-center flex flex-col items-center gap-5'>
          {!selectedFile &&<img src={currentUserData.profilePicture}
            alt="Profile Image" className='w-28 h-28 rounded-full ' />}
          <Upload
          accept='.jpeg,.jpg,.png'
          beforeUpload={(file) => {
            if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
              message.error('You can only upload JPG,JPEG,PNG file!');
              return false;
            }
            setSelectedFile(file);
            return false;
          }}
          
          className='cursor-pointer text-white flex flex-col items-center'
          maxCount={1}
          listType={selectedFile ? 'picture' : 'text'}>
            <Button icon={<UploadOutlined />} className='bg-yellow-500'>
            Change Profile Image
            </Button>
            
            </Upload>
        </div>
        <Divider className='bg-white' />

        <div className='flex flex-col gap-5 '>
          {getProperty('Name', currentUserData.name)}
          {getProperty('Username', currentUserData.userName)}
          {getProperty('ID', currentUserData._id)}
          {getProperty('Email', currentUserData.email)}
          {getProperty('Joined On', dayjs(currentUserData.createdAt).format('DD MMM YYYY hh:mm A'))}

        </div>

        <div className='mt-5 flex flex-col gap-2'>
        <Button className='w-full bg-yellow-500' block
            onClick={onProfilePictureUpdate}
            loading={loading}
            disabled={!selectedFile}
          >

            Update Profile
          </Button>

          <Button className='w-full bg-yellow-500' block
            onClick={onLogOut}
            loading={loading && !selectedFile}
          >

            LogOut
          </Button>
        </div>


      </div>)}

    </Drawer>
  )
}

export default CurrentUserInfo