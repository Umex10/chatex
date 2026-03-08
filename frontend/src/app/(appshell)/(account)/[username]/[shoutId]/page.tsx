"use client"

import RenderShouts from '@/components/RenderShouts';
import { useGetShoutQuery } from '@redux/api/shoutApi';
import React, { use } from 'react'
import { Shout } from '../../../../../../constants/Shout';

/** Page displaying a single shout by its ID, resolved from the URL parameters. */
const Page = ({ params }: { params: Promise<Record<string, string>> }) => {
  const resolvedParams = use(params);

  const segments = Object.values(resolvedParams);
  const shoutId = segments[segments.length - 1];
  const username = segments[segments.length - 2];

  const {data: shout, isLoading} = useGetShoutQuery({username, shoutId});

  return (
    <div className='w-full'>
      {/* Single Shout View */}
      <RenderShouts isLoading={isLoading} shouts={shout ? [shout as Shout] : []}></RenderShouts>
    </div>
  )
}

export default Page