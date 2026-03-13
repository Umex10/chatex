"use client"

import RenderShouts from '@/components/feed/RenderShouts';
import { useGetQuotesQuery } from '@redux/api/shoutApi';
import React, { use } from 'react'

/**
 * Page displaying all quotes associated with a specific shout.
 * Fetches quotes and renders them using the RenderShouts component.
 */
const QuotesPage = ({ params }: { params: Promise<Record<string, string>> }) => {

  const resolvedParams = use(params);

  const segments = Object.values(resolvedParams);
  const shoutId = segments[segments.length - 1];

  const { data: quotes, isLoading } = useGetQuotesQuery(shoutId);

  return (

    /* Quotes List Render */
    <RenderShouts shouts={quotes ? quotes : []} isLoading={isLoading}></RenderShouts>

  )
}

export default QuotesPage
