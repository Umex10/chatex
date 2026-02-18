"use client"

import Shout from '@/components/Shout';
import { RootState } from '@redux/store';
import Image from 'next/image'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { ScanLine } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';


const Account = () => {

  const [activeTab, setActiveTab] = useState("shouts");
  const shouts = useSelector((state: RootState) => state.shoutsState.shouts);

  return (
    <div className='flex flex-col h-screen'>
      <div className='w-full flex flex-col gap-2'>

        {/* Banner */}
        <div className='relative w-full'>
          <Image
            src="/stadion.jpg"
            width={400}
            height={300}
            alt='Account Banner'
            className='w-full h-40' />

          <Image
            src="/acc.png"
            width={100}
            height={130}
            alt="Chatex Logo"
            className="w-23 h-23 rounded-full absolute left-2 bottom-0 translate-y-1/2"
          />
        </div>


        <div className='flex flex-row px-2 pt-12'>
          <div className='flex-1 flex flex-col justify-center gap-2'>
            <div>
              <h2 className='text-xl font-bold'>Was seite</h2>
              <h3 className='text-base'>@wasSeite10</h3>
            </div>
            <Link href="/account/about" className='flex flex-row gap-2 items-center opacity-50'>
              <CalendarDays className='w-4 h-5 -mt-1/2'></CalendarDays>
              <span>Beigetreten Mai 2022</span>
            </Link>
            <div className='flex flex-row gap-4'>
              <h4 className='flex gap-1'>
                <span className='font-bold'>83</span>
                <span className='opacity-50'>Following</span>
              </h4>

              <h5 className='flex gap-1'>
                <span className='font-bold'>8</span>
                <span className='opacity-50'>Follower</span>
              </h5>
            </div>
          </div>
          <div className='h-full flex justify-end items-start'>
            <Button variant="outline" className='rounded-xl'>
              Account bearbeiten
            </Button>
          </div>
        </div>

        <Tabs defaultValue="shouts" className="w-full"
          onValueChange={setActiveTab}>
          <TabsList className='bg-background w-full grid grid-cols-3 h-14 p-0'>
            <TabsTrigger value="shouts" className={`flex-1 text-lg
            ${activeTab === "shouts" ? "underline decoration-2 underline-offset-20" : ""}`}>Shouts</TabsTrigger>

            <TabsTrigger value="replies" className={`flex-1 text-lg
            ${activeTab === "replies" ? "underline decoration-2 underline-offset-20" : ""}`}>Replies</TabsTrigger>

            <TabsTrigger value="media" className={`flex-1 text-lg
            ${activeTab === "media" ? "underline decoration-2 underline-offset-20" : ""}`}>Media</TabsTrigger>

          </TabsList>
          <TabsContent value="shouts" className='m-0'>
            {shouts.map(shout => (
              <Shout {...shout} key={shout.name}></Shout>
            ))}
          </TabsContent>
          <TabsContent value="replies" className='m-0'>
            {shouts.map(shout => (
              <Shout {...shout} key={shout.name}></Shout>
            ))}
          </TabsContent>
          <TabsContent value="media" className='m-0'>
            {shouts.map(shout => (
              <Shout {...shout} key={shout.name}></Shout>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Account
