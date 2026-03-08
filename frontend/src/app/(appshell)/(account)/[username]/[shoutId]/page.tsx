"use client"

import RenderShouts from '@/components/RenderShouts';
import { useGetShoutQuery } from '@redux/api/apiSlice';
import React, { use } from 'react'
import { Shout } from '../../../../../../constants/Shout';

const Page = ({ params }: { params: Promise<Record<string, string>> }) => {
  const resolvedParams = use(params);

  const segments = Object.values(resolvedParams);
  const shoutId = segments[segments.length - 1];
  const username = segments[segments.length - 2];

  const {data: shout, isLoading} = useGetShoutQuery({username, shoutId});

  return (
    <div className='w-full'>
      <RenderShouts isLoading={isLoading} shouts={shout ? [shout as Shout] : []}></RenderShouts>
    </div>
  )
}

export default Page