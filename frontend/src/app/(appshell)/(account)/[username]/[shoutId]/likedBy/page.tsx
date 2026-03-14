"use client"

import FollowInstance from '@/components/follow/FollowInstance';
import RenderFollowList from '@/components/follow/RenderFollowList';
import ReturnHeader from '@/components/layout/ReturnHeader';
import { useGetLikedByQuery } from '@redux/api/shoutApi';
import React from 'react'
import { useParams } from 'next/navigation';

/** Page displaying all users who liked a specific shout. */
const LikedByPage = () => {
  const params = useParams<{ shoutId: string }>();
  const shoutId = params.shoutId;

  const { data: likedUsers, isLoading } = useGetLikedByQuery(shoutId);

  return (
    <div className='flex flex-col'>
      {/* Return Header */}
      <ReturnHeader returnText='Liked By'></ReturnHeader>

      {/* Renders the list of users who liked the shout */}
      <RenderFollowList list={likedUsers ? likedUsers : []}
        isLoading={isLoading}></RenderFollowList>
    </div>
  )
}

export default LikedByPage
