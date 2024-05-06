'use client'
import { UserType } from '@/interfaces';
import { getCurrentUserfromMongoDB } from '@/server-actions/user';
import { Avatar, message } from 'antd';
import React from 'react'
import CurrentUserInfo from './current-user-info';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser, setOnlineUsers, UserState } from '@/redux/userSlice';
import { useRouter } from 'next/navigation';
import socket from '@/config/socket-config';

function Header() {
    const router=useRouter();
    const pathname = usePathname();

    const isPublicRoute = pathname.includes('sign-in') || pathname.includes('sign-up');
    if (isPublicRoute) {
        return null;
    }
    const dispatch = useDispatch();

    const { currentUserData }: UserState = useSelector((state: any) => state.user);
    const [showcurrentUserInfo, setshowCurrentUserInfo] = React.useState<boolean>(false);


    const getCurrentUser = async () => {
        try {
            const response = await getCurrentUserfromMongoDB();
            if (response.error) {
                throw new Error(response.error);
            }
            dispatch(setCurrentUser(response as UserType));

        } catch (error: any) {
            message.error(error.message);

        }
    }

    React.useEffect(() => {
        getCurrentUser();
    }, [])

    React.useEffect(()=>{
        if(currentUserData){
            socket.emit('join',currentUserData._id);
            socket.on('online-users-updated',(onlineUsers:string[])=>{
                dispatch(setOnlineUsers(onlineUsers));
            })
        }
    },[currentUserData])


    return (
        currentUserData &&
        <div className='bg-primary w-full p-3 flex justify-between items-center border-b border-solid border-gray-300' id='header'>
            <div>
                <Avatar src='/ankitLogo.svg' alt='logo' className='cursor-pointer h-8 w-48 md:w-64' onClick={()=>router.push('/')}/>
            </div>
            <div className='text-white gap-3 flex items-center'>
                <span className='text-white text-sm uppercase font-semibold'>{currentUserData?.userName}</span>
                <Avatar className='cursor-pointer' onClick={() => setshowCurrentUserInfo(true)} size='large'
                    src={currentUserData?.profilePicture} />
            </div>
            {showcurrentUserInfo && (<CurrentUserInfo 
                setshowCurrentUserInfo={setshowCurrentUserInfo}
                showCurrentUserInfo={showcurrentUserInfo}

            />)}


        </div>
    )
}

export default Header;