"use client"

import { twitterUsers } from '@/utils/dummy'
import FollowInstance from '@/components/follow/FollowInstance'
import { usePathname } from 'next/navigation';
import { useGetFollowersQuery, useGetFollowingQuery } from '@redux/api/apis/followApi';
import RenderFollowList from '@/components/follow/RenderFollowList';

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
    <div className='flex flex-col'>
      {/* Renders the Follow list using the fetched following accounts */}
      <RenderFollowList variant='ACCOUNT' list={followers ? followers : []} isLoading={isLoading}></RenderFollowList>
    </div>
  )
}

export default Following
