"use client"

import Shout from '@/components/Shout'
import React, { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * Home page component displaying the main content feed for authenticated users.
 */
const Home = () => {

  const [activeTab, setActiveTab] = useState("for-you");

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
            <Shout
        accImg='/acc.png'
        name='Fabrizio Roman'
        hasBadge={true}
        username='Fabrizio14'
        createdAt="1 std."
        desc="Mein erster Beitrag was looooooo
      Mein erster Beitrag was looooooo
      Mein erster Beitrag was looooooo"
        shoutImg='/stadion.jpg'
        comments={1000}
        reShouts={500}
        likes={10000}
      >

      </Shout>
      <Shout
        accImg='/acc.png'
        name='Fabrizio'
        hasBadge={true}
        username='Fabrizio14'
        createdAt="1 std."
        desc="Mein erster Beitrag was looooooo
      Mein erster Beitrag was looooooo
      Mein erster Beitrag was looooooo"
        shoutImg='/stadion.jpg'
        comments={1000}
        reShouts={500}
        likes={10000}
      >

      </Shout>
        </TabsContent>
        <TabsContent value="following" className='m-0 md:min-w-[700px]'>Change your following here.</TabsContent>
      </Tabs>
    </div>
  )
}

export default Home
