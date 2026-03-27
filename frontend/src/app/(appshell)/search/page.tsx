"use client"

import RenderFollowList from '@/components/follow/RenderFollowList'
import SearchUsersInput from '@/components/shared/SearchInput'
import { useGetRecentlyViewedUsersQuery } from '@redux/api/apis/userApi'
import React from 'react'

const SearchPage = () => {

  const { data: recentlyViewedUsers, isLoading } = useGetRecentlyViewedUsersQuery();

  return (
    <div className='w-full'>
      <div className='w-full flex flex-col p-3'>
        <div className='w-full relative z-10'>
          <SearchUsersInput variant='ACCOUNT'/>
        </div>

        <div className='pt-5 text-muted-foreground'>
          <div className='flex flex-col items-start w-full'>
          <h3>Users you recently interacted with</h3>

          <div className='flex flex-col w-full'>
            <RenderFollowList variant='ACCOUNT' list={recentlyViewedUsers ? recentlyViewedUsers : []} isLoading={isLoading}></RenderFollowList>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
