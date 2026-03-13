"use client"

import FollowInstance from '@/components/follow/FollowInstance';
import RenderFollowList from '@/components/follow/RenderFollowList';
import ReturnHeader from '@/components/layout/ReturnHeader';
import { useGetLikedByQuery } from '@redux/api/shoutApi';
import React, { use } from 'react'

/** Page displaying all users who liked a specific shout. */
const Page = ({ params }: { params: Promise<Record<string, string>> }) => {
  const resolvedParams = use(params);

  const segments = Object.values(resolvedParams);
  const shoutId = segments[segments.length - 1];
  const { data: likedUsers, isLoading } = useGetLikedByQuery(shoutId);

  return (

    <div className='flex flex-col'>
      {/* Return Header */}
      <ReturnHeader returnText='Liked By'></ReturnHeader>
      <RenderFollowList list={likedUsers ? likedUsers : []}
        isLoading={isLoading}></RenderFollowList>
    </div>


  )
}

export default Page
