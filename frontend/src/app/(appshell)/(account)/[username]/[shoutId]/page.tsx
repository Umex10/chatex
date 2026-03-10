"use client"

import RenderShouts from '@/components/feed/RenderShouts';
import { useGetCommentsQuery, useGetShoutQuery } from '@redux/api/shoutApi';
import React, { use } from 'react'
import { Shout } from '@/types/Shout';
import ReturnHeader from '@/components/layout/ReturnHeader';
import { ShoutComposer } from '@/components/feed/CreateShout';

export interface CreateCommentPayload {
  text: string,
  images: string[], 
  mainShoutId: string
}

/** Page displaying a single shout by its ID, resolved from the URL parameters. */
const Page = ({ params }: { params: Promise<Record<string, string>> }) => {
  const resolvedParams = use(params);

  const segments = Object.values(resolvedParams);
  const shoutId = segments[segments.length - 1];
  const username = segments[segments.length - 2];

  const { data: shout, isLoading: isLoadingShout } = useGetShoutQuery({ username, shoutId });
  const { data: comments, isLoading: isLoadingCommnets} = useGetCommentsQuery(shoutId);

  return (
    <div className='w-full'>
      <ReturnHeader returnText={`Shout of ${shout?.username}`}></ReturnHeader>
      {/* Single Shout View */}
      <RenderShouts isLoading={isLoadingShout} shouts={shout ? [shout as Shout] : []}></RenderShouts>

      <div className='hidden md:block p-3 w-full border-y'>
        <ShoutComposer placeholder="Comment on the shout" submitText='Comment'
        mode='COMMENT_ON_SHOUT' mainShoutId={shout?.id} />
      </div>

       <RenderShouts isLoading={isLoadingCommnets} shouts={comments ? comments : []}></RenderShouts>
    </div>
  )
}

export default Page