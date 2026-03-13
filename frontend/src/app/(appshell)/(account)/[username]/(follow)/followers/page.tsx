"use client"

import FollowInstance from '@/components/follow/FollowInstance'
import RenderFollowList from '@/components/follow/RenderFollowList'
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
    <div className='flex flex-col'>
      {/* Renders the Follow list using the fetched followers */}
      <RenderFollowList list={followers ? followers : []} isLoading={isLoading}></RenderFollowList>
    </div>
  )
}

export default Followers
