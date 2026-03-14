"use client"

import RenderShouts from '@/components/shout/RenderShouts';
import { useGetQuotesQuery } from '@redux/api/shoutApi';
import React from 'react'
import { useParams } from 'next/navigation';

/**
 * Page displaying all quotes associated with a specific shout.
 * Fetches quotes and renders them using the RenderShouts component.
 */
const QuotesPage = () => {

  const params = useParams<{ shoutId: string }>();
  const shoutId = params.shoutId;

  const { data: quotes, isLoading } = useGetQuotesQuery(shoutId);

  return (

    /* Quotes List Render */
    <RenderShouts shouts={quotes ? quotes : []} isLoading={isLoading}></RenderShouts>

  )
}

export default QuotesPage
