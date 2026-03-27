import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import SearchUsersInput from '../shared/SearchInput'
import RenderFollowList from '../follow/RenderFollowList'
import { useGetRecentlyViewedUsersQuery } from '@redux/api/apis/userApi'

const CreateChatDialog = ({children}: {children: React.ReactNode}) => {

  const { data: recentlyViewedUsers, isLoading } = useGetRecentlyViewedUsersQuery();

  return (

    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>

        <SearchUsersInput variant='CHAT' />

        <div className=''>
          <h3>Users you recently interacted with</h3>

          <div className='flex flex-col overflow-y-scroll max-h-[40vh]'>
            <RenderFollowList variant='CHAT' list={recentlyViewedUsers ? recentlyViewedUsers : []} isLoading={isLoading}></RenderFollowList>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChatDialog
