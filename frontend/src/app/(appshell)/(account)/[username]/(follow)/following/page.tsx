"use client"

import { twitterUsers } from '@/utils/dummy'
import FollowInstance from '@/components/FollowInstance'
import { usePathname } from 'next/navigation';
import { useGetFollowersQuery, useGetFollowingQuery } from '@redux/api/followApi';
import RenderFollowList from '@/components/RenderFollowList';

/**
 * Page displaying the list of accounts a given user is following.
 * Extracts the username from the URL path and fetches the following list via RTK Query.
 */
const Following = () => {

  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const username = segments[segments.length - 2];

  const { data: followers, isLoading } = useGetFollowingQuery(username);

  return (
    <RenderFollowList list={followers ? followers : []} isLoading={isLoading}></RenderFollowList>
  )
}

export default Following
