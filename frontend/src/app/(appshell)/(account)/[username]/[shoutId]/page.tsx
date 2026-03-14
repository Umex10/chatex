"use client"

import RenderShouts from '@/components/feed/RenderShouts';
import { useGetCommentsQuery, useGetShoutQuery } from '@redux/api/shoutApi';
import React from 'react'
import { useParams } from 'next/navigation';
import { Shout } from '@/types/Shout';
import ReturnHeader from '@/components/layout/ReturnHeader';
import { ShoutComposer } from '@/components/feed/CreateShout';

export interface CreateCommentPayload {
  text: string,
  images: string[], 
  commentedShoutId: string
}

/** Page displaying a single shout by its ID, resolved from the URL parameters. */
const SingleShoutPage = () => {
  const params = useParams<{ username: string, shoutId: string }>();
  const shoutId = params.shoutId;
  const username = params.username;

  const { data: shout, isLoading: isLoadingShout } = useGetShoutQuery({ username, shoutId });
  const { data: comments, isLoading: isLoadingCommnets} = useGetCommentsQuery(shoutId);

  return (
    <div className='w-full'>
      <ReturnHeader returnText={`Shout of ${shout?.username}`}></ReturnHeader>
      {/* Single Shout View */}
      <RenderShouts isLoading={isLoadingShout} shouts={shout ? [shout as Shout] : []}></RenderShouts>

      <div className='hidden md:block p-3 w-full border-y'>
        <ShoutComposer placeholder="Comment on the shout" submitText='Comment'
        variant='COMMENT' commentedShoutId={shout?.id} />
      </div>

       <RenderShouts isLoading={isLoadingCommnets} shouts={comments ? comments : []}></RenderShouts>
    </div>
  )
}

export default SingleShoutPage