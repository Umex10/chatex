"use client"

import Shout from '@/components/Shout';
import { RootState } from '@redux/store';
import Image from 'next/image'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CldImage } from 'next-cloudinary';
import { useGetUserQuery } from '@redux/api/apiSlice';

const Account = () => {

  const [activeTab, setActiveTab] = useState("shouts");
  const shouts = useSelector((state: RootState) => state.shoutsState.shouts);
  const { data: user, isLoading } = useGetUserQuery(undefined);

  const avatar = user?.avatar ? user?.avatar : "user-avatar_yr4qhg";
  const name = user?.name ? user?.name : "Was seite";
  const username = user?.username ? user?.username : "@wasSeite10";
  const createdAt = user?.createdAt ? user?.createdAt : "Joined";

  function joinedDate(createdAt: string) {

    const date = new Date(createdAt);

    // ("Month: f.e: February")
    const month = date.toLocaleString('de-DE', { month: 'long' });

    // ("Year: f.e: 2025")
    const year = date.getFullYear();

    return `Joined ${month} ${year}`
  }

  return (

    <div className='w-full flex-1 flex flex-col gap-2'>

      {/* Banner */}
      <div className='relative w-full'>
        <div className="bg-zinc-800 w-full h-40">
          <Image
            src="/stadion.jpg"
            width={800}
            height={200}
            alt='Account Banner'
            className='w-full h-40 object-cover'
          />
        </div>

        <div className="absolute left-4 bottom-0 translate-y-1/2">
          <div className="relative w-24 h-24 rounded-full border-4 border-black overflow-hidden bg-zinc-900">
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
        </div>
      </div>

      <div className='flex flex-row px-3'>
        <div className='flex-1 flex flex-col justify-center gap-2  pt-12'>
          <div>
            <h2 className='text-xl font-bold'>{name}</h2>
            <h3 className='text-base'>{username}</h3>
          </div>
          <Link href="/account/about" className='flex flex-row gap-2 items-center opacity-50'>
            <CalendarDays className='w-4 h-5 -mt-1/2'></CalendarDays>
            <span>{joinedDate(createdAt)}</span>
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
          <Link href="/account/settings" className='rounded-xl p-2 border text-base font-bold'>
            Account bearbeiten
          </Link>
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
  )
}

export default Account
