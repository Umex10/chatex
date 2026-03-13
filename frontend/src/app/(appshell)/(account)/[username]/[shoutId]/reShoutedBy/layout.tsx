"use client"

import React, { use, useState } from 'react'

import { Tabs, TabsContent } from "@/components/ui/tabs"
import ReusableTabsList from '@/components/layout/ReusableTabsList';
import { useGetQuotesQuery, useGetReShoutedByQuery, useGetShoutsQuery } from '@redux/api/shoutApi';
import RenderShouts from '@/components/feed/RenderShouts';
import RenderFollowList from '@/components/follow/RenderFollowList';
import { useRouter } from 'next/navigation';
import ReturnHeader from '@/components/layout/ReturnHeader';

export type CreateShoutPlayoad = { shoutId?: string, text: string; images: string[] };


/**
 * Layout for the re-shouts and quotes activity tab group.
 * Renders a sticky return header and navigation tabs for re-shouts and quotes.
 */
const ActivityByLayout = ({ params, children }: { params: Promise<Record<string, string>>, children: React.ReactNode }) => {

  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState("reShoutedBy");

  const segments = Object.values(resolvedParams);
  const shoutId = segments[segments.length - 1];
  const username = segments[segments.length - 2];

  const router = useRouter();

  return (
    <div className='w-full'>

      {/* Return Header */}
      <ReturnHeader returnText={activeTab === "reShoutedBy" ? "Re-Shouted by" : "Quoted by"}></ReturnHeader>

      {/* Tab Navigation */}
      <Tabs defaultValue="reShoutedBy" className="w-full" onValueChange={setActiveTab}>
        <ReusableTabsList
          activeTab={activeTab}
          gridCols={2}
          tabs={[
            {
              value: "reShoutedBy",
              label: "Re-Shouts",
              href: `/${username}/${shoutId}/reShoutedBy/reShouts`
            },
            {
              value: "quotedBy",
              label: "Quotes",
              href: `/${username}/${shoutId}/reShoutedBy/quotes`
            }
          ]}
        />

        <TabsContent value="reShoutedBy" className='m-0 flex-1 sm:border'>
            <div className="w-full flex-col">
                     {children}
            </div>
   
        </TabsContent>
 
        <TabsContent value="quotedBy" className='m-0 flex-1 sm:border'>
          {children}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ActivityByLayout
