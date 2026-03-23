"use client"

import { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { CreateShout, ShoutComposer } from '@/components/shout/CreateShout';
import { PencilLine } from 'lucide-react';
import { useGetRecentFollowingShoutsQuery, useGetRecentShoutsQuery } from '@redux/api/apis/shoutApi';
import { useGetUserQuery } from '@redux/api/apis/userApi';
import RenderShouts from '@/components/shout/RenderShouts';

export type CreateShoutPlayoad = { shoutId?: string, text: string; images: string[] };

/**
 * Home feed page for authenticated users.
 * Displays a tabbed shout feed ("For you" / "Following") and a
 * floating compose button on mobile screens.
 */
const Home = () => {

  const [activeTab, setActiveTab] = useState("recent");

  const { data: recentShouts, isLoading: isLoadingRecentShouts, } = useGetRecentShoutsQuery(undefined, {
    skip: activeTab !== "recent"
  });
  const { data: recentFollowingShouts, isLoading: isLoadingRecentFollowingShouts } = useGetRecentFollowingShoutsQuery(undefined, {
    skip: activeTab !== "following"
  });

  return (
    <div className='w-full text-3xl'>

      {/* Tab Navigation */}
      <Tabs defaultValue="recent" className="w-full" onValueChange={setActiveTab}>
        <TabsList className='bg-background w-full grid grid-cols-2 h-14 p-0'>
          <TabsTrigger value="recent" className={`flex-1 text-lg
            ${activeTab === "recent" ? "underline decoration-2 underline-offset-20" : ""}`}>Recent</TabsTrigger>
          <TabsTrigger value="following" className={`flex-1 text-lg
            ${activeTab === "following" ? "underline decoration-2 underline-offset-20" : ""}`}>Following</TabsTrigger>
        </TabsList>

        {/* Inline composer — desktop only */}
        <div className='hidden md:block p-3 w-full border-y'>
          <ShoutComposer placeholder="What's new to you?"
            variant='DEFAULT' />
        </div>

        {/* "For You" Feed */}
        <TabsContent value="recent" className='m-0'>
          <RenderShouts isLoading={isLoadingRecentShouts} shouts={recentShouts ? recentShouts : []}></RenderShouts>
        </TabsContent>
        {/* "Following" Feed */}
        <TabsContent value="following" className='m-0'>
          <RenderShouts isLoading={isLoadingRecentFollowingShouts} shouts={recentFollowingShouts ? recentFollowingShouts : []}></RenderShouts>
        </TabsContent>
      </Tabs>

      {/* Floating compose button — mobile only */}
      <CreateShout variant='DEFAULT'>
        <Button className="fixed right-6 bottom-24 h-12 w-12 rounded-full bg-violet-500 md:hidden [&_svg]:!size-6">
          <PencilLine className="w-8 h-8 text-white" />
        </Button>
      </CreateShout>
    </div>
  )
}

export default Home
