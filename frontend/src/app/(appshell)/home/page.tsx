"use client"

import OneShout from '@/components/shout/OneShout'
import React, { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { CreateShout, ShoutComposer } from '@/components/shout/CreateShout';
import { PencilLine } from 'lucide-react';
import { useGetShoutsQuery } from '@redux/api/shoutApi';
import { useGetUserQuery } from '@redux/api/userApi';
import RenderShouts from '@/components/shout/RenderShouts';

export type CreateShoutPlayoad = { shoutId?: string, text: string; images: string[] };

/**
 * Home feed page for authenticated users.
 * Displays a tabbed shout feed ("For you" / "Following") and a
 * floating compose button on mobile screens.
 */
const Home = () => {

  const [activeTab, setActiveTab] = useState("for-you");

  const { data: user } = useGetUserQuery(undefined);
  const username = user?.username ?? "";
  const { data: shouts, isLoading } = useGetShoutsQuery(username);

  return (
    <div className='w-full text-3xl'>

      {/* Tab Navigation */}
      <Tabs defaultValue="for-you" className="w-full" onValueChange={setActiveTab}>
        <TabsList className='bg-background w-full grid grid-cols-2 h-14 p-0'>
          <TabsTrigger value="for-you" className={`flex-1 text-lg
            ${activeTab === "for-you" ? "underline decoration-2 underline-offset-20" : ""}`}>For you</TabsTrigger>
          <TabsTrigger value="following" className={`flex-1 text-lg
            ${activeTab === "following" ? "underline decoration-2 underline-offset-20" : ""}`}>Following</TabsTrigger>
        </TabsList>

        {/* Inline composer — desktop only */}
        <div className='hidden md:block p-3 w-full border-y'>
          <ShoutComposer placeholder="What's new to you?"
            variant='DEFAULT' />
        </div>

        {/* "For You" Feed */}
        <TabsContent value="for-you" className='m-0'>
          <RenderShouts isLoading={isLoading} shouts={shouts ? shouts : []}></RenderShouts>
        </TabsContent>
        {/* "Following" Feed */}
        <TabsContent value="following" className='m-0'>Change your following here.</TabsContent>
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
