"use client"

import RenderShouts from '@/components/feed/RenderShouts';
import RenderFollowList from '@/components/follow/RenderFollowList';
import ReturnHeader from '@/components/layout/ReturnHeader';
import { useGetQuotesQuery, useGetReShoutedByQuery } from '@redux/api/shoutApi';
import React from 'react'
import { useParams } from 'next/navigation';

/**
 * Page displaying all users who re-shouted a specific shout.
 */
const ReShoutsPage = () => {

  const params = useParams<{ shoutId: string }>();
  const shoutId = params.shoutId;

  const { data: reShoutedUsers, isLoading } = useGetReShoutedByQuery(shoutId);

  return (
    /* Re-shouters List Render */
    < RenderFollowList list={reShoutedUsers ? reShoutedUsers : []}
      isLoading={isLoading} ></RenderFollowList >

  )
}

export default ReShoutsPage
