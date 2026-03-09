"use client"

import FollowInstance from '@/components/FollowInstance'
import RenderFollowList from '@/components/RenderFollowList'
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
    <RenderFollowList list={followers ? followers : []} isLoading={isLoading}></RenderFollowList>
  )
}

export default Followers
