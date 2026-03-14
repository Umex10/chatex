"use client"

import React, { useState } from 'react'
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CldImage } from 'next-cloudinary';
import { useGetAllImagesQuery, useGetLikedByQuery, useGetLikedShoutsQuery, useGetShoutsQuery, useGetUserCommentsQuery } from '@redux/api/shoutApi';
import { useGetUserByUsernameQuery, useGetUserQuery } from '@redux/api/userApi';
import { joinedAccountDate } from '@/utils/joinedDate';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useFollow } from '@/hooks/use-follow';
import RenderShouts from '@/components/shout/RenderShouts';

/**
 * Dynamic user Account page.
 * Renders the Account of either the currently authenticated user or any other user
 * identified by the `username` route parameter.
 * Fetches the "other" user's data only when the account does not belong to the current user.
 * Displays the user's banner, avatar, bio, join date, follower stats,
 * and a tabbed feed of their shouts, comments and media.
 */
const AccountPage = () => {

  const params = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState("shouts");
  const { data: meUser } = useGetUserQuery();
  const router = useRouter();

  const otherUsername = params.username;
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

  const { data: shouts, isLoading: isLoadingShouts } = useGetShoutsQuery(username, {
    skip: activeTab !== "shouts"
  });

  const { data: userComments, isLoading: isLoadingUserComments } = useGetUserCommentsQuery(username, {
    skip: activeTab !== "comments"
  });

  const { data: likedShouts, isLoading: isLoadingLikedShouts } = useGetLikedShoutsQuery(username, {
    skip: activeTab !== "liked-shouts"
  });

  const { data: images, isLoading: isLoadingImages } = useGetAllImagesQuery(username, {
    skip: activeTab !== "media"
  });


  const { followText, onToggleFollow } = useFollow({ username, userFollowingTarget: isRequestingUserFollowing });

  if (isError && !isOwnAccount) {
    return <div className='w-full h-full flex-1 text-center'>
      {/* User Not Found */}
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

        {/* Avatar */}
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

      {/* User Info Section */}
      <div className='flex flex-row px-3'>
        <div className='flex-1 flex flex-col justify-center gap-2  pt-12'>
          <div>
            <h2 className='text-xl font-bold'>{name}</h2>
            <h3 className='text-base'>{username}</h3>
          </div>
          {/* Bio */}
          {bio && (
            <p className='text-base'>
              {bio}
            </p>
          )}

          {/* Join Date */}
          <Link href="/account/about" className='flex flex-row gap-2 items-center opacity-50'>
            <CalendarDays className='w-4 h-5 -mt-1/2'></CalendarDays>
            <span>{joinedAccountDate(createdAt)}</span>
          </Link>
          {/* Follower Stats */}
          <div className='flex flex-row gap-4'>
            <h4 className='flex gap-1'
              onClick={() => router.push(`${username}/following`)}
              data-testid="following-list">
              <span className='font-bold' data-testid="following-count">{followingCount}</span>
              <span className='opacity-50'>Following</span>
            </h4>

            <h4 className='flex gap-1'
              onClick={() => router.push(`${username}/followers`)}
              data-testid="followers-list">
              <span className='font-bold' data-testid="followers-count">{followersCount}</span>
              <span className='opacity-50'>Follower</span>
            </h4>
          </div>
        </div>

        {/* Edit Account / Follow Button */}
        <div className='h-full flex justify-end items-start'>

          <Link href="/settings" className={`${isOwnAccount ? "" : "hidden"}
              rounded-xl px-3 py-2 border text-base font-bold`}
            data-testid="edit-account-btn">
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

      {/* Shout Feed Tabs */}
      <Tabs defaultValue="shouts" className="w-full"
        onValueChange={setActiveTab}>
        <TabsList className='bg-background w-full grid grid-cols-4 h-14 p-0'>
          <TabsTrigger value="shouts" className={`flex-1 text-lg
            ${activeTab === "shouts" ? "underline decoration-2 underline-offset-20" : ""}`}>Shouts</TabsTrigger>

          <TabsTrigger value="comments" className={`flex-1 text-lg
            ${activeTab === "comments" ? "underline decoration-2 underline-offset-20" : ""}`}>Comments</TabsTrigger>

          <TabsTrigger value="liked-shouts" className={`flex-1 text-lg
            ${activeTab === "liked-shouts" ? "underline decoration-2 underline-offset-20" : ""}`}>Liked Shouts</TabsTrigger>


          <TabsTrigger value="media" className={`flex-1 text-lg
            ${activeTab === "media" ? "underline decoration-2 underline-offset-20" : ""}`}>Media</TabsTrigger>

        </TabsList>
        {/* Shouts Tab Content */}
        <TabsContent value="shouts" className='m-0'>
          <RenderShouts isLoading={isLoadingShouts} shouts={shouts ? shouts : []}></RenderShouts>
        </TabsContent>
        {/* Replies Tab Content */}
        <TabsContent value="comments" className='m-0'>
          <RenderShouts isLoading={isLoadingShouts} shouts={userComments ? userComments : []}></RenderShouts>
        </TabsContent>

        <TabsContent value="liked-shouts" className='m-0'>
          <RenderShouts isLoading={isLoadingLikedShouts} shouts={likedShouts ? likedShouts : []}></RenderShouts>
        </TabsContent>
        {/* Media Tab Content */}
        <TabsContent value="media" className='m-0'>
          <div className='grid grid-cols-3'>
            {images?.map((img, index) => (
              <div key={img + index} className="relative aspect-square">
                <CldImage fill src={img} alt={img} crop="fill" format="auto" quality="auto" sizes="200px" className="object-cover" />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AccountPage
