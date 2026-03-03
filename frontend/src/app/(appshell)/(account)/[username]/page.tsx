"use client"

import Shout from '@/components/Shout';
import { RootState } from '@redux/store';
import React, { use, useState } from 'react'
import { useSelector } from 'react-redux';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CldImage } from 'next-cloudinary';
import { useGetUserByUsernameQuery, useGetUserQuery, useUnfollowUserMutation } from '@redux/api/apiSlice';
import { joinedDate } from '@/utils/joinedDate';
import { Button } from '@/components/ui/button';
import {  useRouter } from 'next/navigation';
import { useFollow } from '@/hooks/use-follow';

/**
 * Dynamic user Account page.
 * Renders the Account of either the currently authenticated user or any other user
 * identified by the `username` route parameter.
 * Fetches the "other" user's data only when the account does not belong to the current user.
 * Displays the user's banner, avatar, bio, join date, follower stats,
 * and a tabbed feed of their shouts, replies and media.
 */
const Page = ({ params }: { params: Promise<{ username: string }> }) => {

  const [activeTab, setActiveTab] = useState("shouts");
  const shouts = useSelector((state: RootState) => state.shoutsState.shouts);
  const { data: meUser } = useGetUserQuery();
  const router = useRouter();

  const resolvedUser = use(params);
  const otherUsername = resolvedUser.username;
  const isOwnAccount = meUser?.username === otherUsername

  const { data: otherUser, isLoading, isError } = useGetUserByUsernameQuery(
    otherUsername,
    { skip: isOwnAccount }
  );

  const userToShow = isOwnAccount ? meUser : otherUser;

  const name = userToShow?.name ? userToShow?.name : "Was seite";
  const avatar = userToShow?.avatar ? userToShow?.avatar : "user-avatar_yr4qhg";
  const banner = userToShow?.banner ? userToShow?.banner : "stadion_x556pn";
  const username = userToShow?.username ? userToShow?.username : "@wasSeite10";
  const createdAt = userToShow?.createdAt ? userToShow?.createdAt : "Joined";
  const bio = userToShow?.bio ? userToShow?.bio : "";
  const followersCount = userToShow?.followersCount ? userToShow?.followersCount : 0;
  const followingCount = userToShow?.followingCount ? userToShow?.followingCount : 0;
  const isRequestingUserFollowing = userToShow?.userFollowingTarget ? userToShow?.userFollowingTarget : false;

  const { followText, onToggleFollow } = useFollow({username, userFollowingTarget: isRequestingUserFollowing});

  if (isError && !isOwnAccount) {
    return <div className='w-full h-full flex-1 text-center'>
      User @{otherUsername} was not found.
    </div>;
  }

  return (

    <div className='w-full flex-1 flex flex-col gap-2'>

      {/* Banner */}
      <div className='relative w-full'>
        <div className="bg-zinc-800 w-full h-40">
          <CldImage
            width={800}
            height={400}
            src={banner}
            alt="User Banner"
            crop="thumb"
            gravity="face"
            format="auto"
            quality="auto"
            className="w-full h-40 object-cover"
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
          {bio && (
            <p className='text-base'>
              {bio}
            </p>
          )}

          <Link href="/account/about" className='flex flex-row gap-2 items-center opacity-50'>
            <CalendarDays className='w-4 h-5 -mt-1/2'></CalendarDays>
            <span>{joinedDate(createdAt)}</span>
          </Link>
          <div className='flex flex-row gap-4'>
            <h4 className='flex gap-1'
              onClick={() => router.push(`${username}/following`)}
              data-testid="following-list">
              <span className='font-bold'>{followingCount}</span>
              <span className='opacity-50'>Following</span>
            </h4>

            <h4 className='flex gap-1'
              onClick={() => router.push(`${username}/followers`)}
              data-testid="followers-list">
              <span className='font-bold'>{followersCount}</span>
              <span className='opacity-50'>Follower</span>
            </h4>
          </div>
        </div>

        <div className='h-full flex justify-end items-start'>

          <Link href="/settings" className={`${isOwnAccount ? "" : "hidden"}
              rounded-xl px-3 py-2 border text-base font-bold`}>
            Account bearbeiten
          </Link>

          <Button variant={!isRequestingUserFollowing ? "outline" : "secondary"}
            className={`${isOwnAccount ? "hidden" : ""}
              rounded-xl px-3 py-2 border text-base font-bold`}
              data-testid="follow-btn"
            onClick={onToggleFollow}>
            {followText}
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
  )
}

export default Page
