import UserModel from '@/models/user-model';
import Link from 'next/link';
import React from 'react'
import GroupForm from '../_components/group-form';
import { UserType } from '@/interfaces';

async function CreateGroup() {
  const users:UserType[]= await UserModel.find({});
  return (
    <div className='p-8'>
        <Link href='/' className="bg-yellow-500 text-primary border font-bold border-primary px-5 py-3 no-underline border-solid rounded-md hover:bg-primary hover:text-yellow-500"
        >Back To Chats</Link>
        <h1 className='text-primary uppercase text-xl font-bold py-2'>Create Group</h1>

        <GroupForm users={
          JSON.parse(JSON.stringify(users))
        } />
    </div>
  )
}

export default CreateGroup;