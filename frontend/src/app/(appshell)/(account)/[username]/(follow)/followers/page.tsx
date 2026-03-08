"use client"

import Follow from '@/components/Follow'
import { useGetFollowersQuery } from '@redux/api/followApi'
import { usePathname } from 'next/navigation'
import React from 'react'

/**
 * Page displaying the followers list for a given user.
 * Extracts the username from the URL path and fetches the followers via RTK Query.
 */
const Followers = () => {

  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const username = segments[segments.length - 2];

  const { data: followers, isLoading } = useGetFollowersQuery(username);

  return (
    <div className='w-full p-3 flex-1 border-y'>
      {/* Loading State */}
      {isLoading ? (

        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      ) : (

        <div className='flex flex-col'>

          {/* Followers List */}
          {followers?.map(user => (
            <Follow {...user} key={user.username} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Followers
