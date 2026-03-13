"use client"

import RenderShouts from '@/components/feed/RenderShouts';
import { useGetQuotesQuery } from '@redux/api/shoutApi';
import React, { use } from 'react'

const Page = ({ params }: { params: Promise<Record<string, string>> }) => {

  const resolvedParams = use(params);

  const segments = Object.values(resolvedParams);
  const shoutId = segments[segments.length - 1];

  const { data: quotes, isLoading } = useGetQuotesQuery(shoutId);

  return (
         <RenderShouts shouts={quotes ? quotes : []}
      isLoading={isLoading}></RenderShouts>
  )
}

export default Page
