"use client"

import Follow from '@/components/Follow';
import ReturnHeader from '@/components/ReturnHeader';
import { useGetLikedByQuery } from '@redux/api/apiSlice';
import React, { use } from 'react'

const Page = ({ params }: { params: Promise<Record<string, string>> }) => {
  const resolvedParams = use(params);

  const segments = Object.values(resolvedParams);
  const shoutId = segments[segments.length - 1];
  const { data: likedUsers, isLoading } = useGetLikedByQuery(shoutId);

  return (
    <div className='w-full p-3 flex-1 border-y'>

      <ReturnHeader returnText='Liked By Users:'></ReturnHeader>

      {isLoading ? (

        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      ) : (

        <div className='flex flex-col'>

          {likedUsers?.map(user => (
            <Follow {...user} key={user.username} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Page
