"use client"

import Shout from '@/components/Shout'
import React, { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CreateShout } from '@/components/CreateShout';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { PencilLine } from 'lucide-react';


/**
 * Home page component displaying the main content feed for authenticated users.
 */
/**
 * Home feed page for authenticated users.
 * Displays a tabbed shout feed ("For you" / "Following") and a
 * floating compose button on mobile screens.
 */
const Home = () => {

  const [activeTab, setActiveTab] = useState("for-you");
  const shouts = useSelector((state: RootState) => state.shoutsState.shouts);

  return (
    <div className='w-full text-3xl'>

      <Tabs defaultValue="for-you" className="w-full"
        onValueChange={setActiveTab}>
        <TabsList className='bg-background w-full grid grid-cols-2 h-14 p-0'>
          <TabsTrigger value="for-you" className={`flex-1 text-lg
            ${activeTab === "for-you" ? "underline decoration-2 underline-offset-20" : ""}`}>For you</TabsTrigger>
          <TabsTrigger value="following" className={`flex-1 text-lg
            ${activeTab === "following" ? "underline decoration-2 underline-offset-20" : ""}`}>Following</TabsTrigger>
        </TabsList>
        <TabsContent value="for-you" className='m-0'>
               {shouts.map(shout => (
        <Shout {...shout} key={shout.name}></Shout>
      ))}
        </TabsContent>
        <TabsContent value="following" className='m-0'>Change your following here.</TabsContent>
      </Tabs>

   
      <CreateShout>
        <Button className="fixed right-6 bottom-24 h-12 w-12 rounded-full bg-violet-500 md:hidden [&_svg]:!size-6">
          <PencilLine className="w-8 h-8 text-white" />
        </Button>
      </CreateShout>
    </div>
  )
}

export default Home
