"use client"

import React from 'react'

import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SearchInput from '@/components/shared/SearchInput';
import RecentlyViewedUser from '@/components/chat/RecentlyViewedInstance';
import { useGetRecentlyViewedUsersQuery } from '@redux/api/userApi';

const DefaultChatView = () => {

  const {data: recentlyViewedUsers, isLoading} = useGetRecentlyViewedUsersQuery();

  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-4'>

      <Mail className='w-30 h-30 rounded-full bg-violet-500 p-5'></Mail>

      <div className='w-full flex flex-col items-center'>
        <h3 className='text-5xl font-bold'>Chat</h3>
        <p className='text-xl text-muted-foreground'>Select a chat or start a new chat in order to chatex!</p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className='bg-transparent text-xl'>
            New Chat
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Chat</DialogTitle>
          </DialogHeader>
          
          <SearchInput />

          <div className=''>
            <h3>Recently viewed Users by you</h3>

            <ul className='overflow-y-scroll max-h-[40vh]'>
              {recentlyViewedUsers?.map(user => (
                <RecentlyViewedUser key={user.username} {...user}></RecentlyViewedUser>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default DefaultChatView