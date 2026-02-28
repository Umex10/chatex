"use client"

import Shout from '@/components/Shout'
import React, { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Button } from '@/components/ui/button';
import { CreateShout } from '@/components/CreateShout';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { PencilLine } from 'lucide-react';
import Image from 'next/image';
import { useGetUserQuery } from '@redux/api/apiSlice';
import { CldImage } from 'next-cloudinary';
import { Textarea } from "@/components/ui/textarea"



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

  const { data: user, isLoading } = useGetUserQuery(undefined);
  const avatar = user?.avatar ? user?.avatar : "user-avatar_yr4qhg";

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
        <div className='hidden md:block p-3 w-full border-y'>
          <div className='flex flex-row gap-1'>
              <div className="w-14 h-14 bg-gray-200 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
            <CldImage
              width="56"
              height="56"
              src={avatar}
              alt="User Avatar"
              crop="thumb"
              gravity="face"
              format="auto"
              quality="auto"
              className="w-full h-full object-cover"
            />
          </div>

          <div className='flex flex-col flex-1 gap-1 items-start'>
              <Textarea placeholder="What's new to you?" className='
              placeholder:text-zinc-500 placeholder:text-lg text-lg
              max-h-[400px]'/>

              <div className='w-full flex flex-row justify-end'>
                <Button className='text-xl rounded-xl' variant="secondary">Shout</Button>
              </div>
          </div>
          </div>
          
        </div>
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
