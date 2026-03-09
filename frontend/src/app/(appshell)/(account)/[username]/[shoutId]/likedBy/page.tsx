"use client"

import FollowInstance from '@/components/FollowInstance';
import ReturnHeader from '@/components/ReturnHeader';
import { useGetLikedByQuery } from '@redux/api/shoutApi';
import React, { use } from 'react'

/** Page displaying all users who liked a specific shout. */
const Page = ({ params }: { params: Promise<Record<string, string>> }) => {
  const resolvedParams = use(params);

  const segments = Object.values(resolvedParams);
  const shoutId = segments[segments.length - 1];
  const { data: likedUsers, isLoading } = useGetLikedByQuery(shoutId);

  return (
    <div className='w-full flex flex-col border-y'>

      {/* Return Header */}
      <ReturnHeader returnText='Liked By Users'></ReturnHeader>

      <div className='flex-1'>
        {/* Loading State */}
        {isLoading ? (

          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          </div>
        ) : (

          <div className='flex flex-col'>

            {/* Liked-By Users List */}
            {likedUsers?.map(user => (
              <FollowInstance {...user} key={user.username} />
            ))}
          </div>
        )}
      </div>


    </div>
  )
}

export default Page
