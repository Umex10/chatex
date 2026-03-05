"use client"

import { twitterUsers } from '@/utils/dummy'
import Follow from '@/components/Follow'
import { usePathname } from 'next/navigation';
import { useGetFollowersQuery, useGetFollowingQuery } from '@redux/api/apiSlice';

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
    <div className='w-full flex-1 p-3 border-y'>
      {isLoading ? (

        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      ) : (

        <div className='flex flex-col gap-5'>

          {followers?.map(user => (
            <Follow {...user} key={user.username} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Following
