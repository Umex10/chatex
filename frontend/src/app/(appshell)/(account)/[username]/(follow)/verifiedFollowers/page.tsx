"use client"

import { twitterUsers } from '@/utils/dummy'
import FollowInstance from '@/components/follow/FollowInstance'
import { usePathname } from 'next/navigation';
import { useGetFollowersQuery, useGetFollowingQuery } from '@redux/api/followApi';
import RenderFollowList from '@/components/follow/RenderFollowList';

/**
 * Page displaying the list of verified followers for a given user.
 * Extracts the username from the URL path and fetches the verified followers via RTK Query.
 */
const VerfiedFollowers = () => {

  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const username = segments[segments.length - 2];

  const { data: followers, isLoading } = useGetFollowingQuery(username);

  return (
    <div className='flex flex-col'>
      {/* Renders the Follow list using the fetched verified followers */}
      <RenderFollowList list={followers ? followers : []} isLoading={isLoading}></RenderFollowList>
    </div>
  )
}

export default VerfiedFollowers
