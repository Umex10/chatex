"use client"

import Shout from '@/components/Shout'
import React, { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CreateShout } from '@/components/CreateShout';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';


/**
 * Home page component displaying the main content feed for authenticated users.
 */
const Home = () => {

  const [activeTab, setActiveTab] = useState("for-you");
  const shouts = useSelector((state: RootState) => state.shoutsState.shouts);

  return (
    <div className='text-3xl md:border'>

      <Tabs defaultValue="for-you" className="w-full"
        onValueChange={setActiveTab}>
        <TabsList className='bg-background w-full grid grid-cols-2 h-14 p-0'>
          <TabsTrigger value="for-you" className={`flex-1 text-lg
            ${activeTab === "for-you" ? "underline decoration-2 underline-offset-20" : ""}`}>For you</TabsTrigger>
          <TabsTrigger value="following" className={`flex-1 text-lg
            ${activeTab === "following" ? "underline decoration-2 underline-offset-20" : ""}`}>Following</TabsTrigger>
        </TabsList>
        <TabsContent value="for-you" className='m-0 md:min-w-[700px]'>
        
        </TabsContent>
        <TabsContent value="following" className='m-0 md:min-w-[700px]'>Change your following here.</TabsContent>
      </Tabs>

      {shouts.map(shout => (
         <Shout {...shout} key={shout.name}></Shout>
      ))}
     

      <CreateShout></CreateShout>
    </div>
  )
}

export default Home
