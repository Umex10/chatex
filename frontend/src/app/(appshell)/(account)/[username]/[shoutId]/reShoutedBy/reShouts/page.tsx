"use client"

import RenderShouts from '@/components/feed/RenderShouts';
import RenderFollowList from '@/components/follow/RenderFollowList';
import ReturnHeader from '@/components/layout/ReturnHeader';
import { useGetQuotesQuery, useGetReShoutedByQuery } from '@redux/api/shoutApi';
import React, { use } from 'react'

/**
 * Page displaying all users who re-shouted a specific shout.
 */
const ReShoutsPage = ({ params }: { params: Promise<Record<string, string>> }) => {

  const resolvedParams = use(params);

  const segments = Object.values(resolvedParams);
  const shoutId = segments[segments.length - 1];

  const { data: reShoutedUsers, isLoading } = useGetReShoutedByQuery(shoutId);

  return (
    /* Re-shouters List Render */
    < RenderFollowList list={reShoutedUsers ? reShoutedUsers : []}
      isLoading={isLoading} ></RenderFollowList >

  )
}

export default ReShoutsPage
