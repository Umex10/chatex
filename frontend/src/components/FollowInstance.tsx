"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Ellipsis } from 'lucide-react'
import { CldImage } from 'next-cloudinary'
import type { Follow as FollowInstance } from '../../constants/Follow'
import { useFollow } from '@/hooks/use-follow'
import { useRouter } from 'next/navigation'

/**
 * Renders a single user row in a follower or following list.
 * Shows the user's avatar, name, username, bio, a follow/unfollow toggle button,
 * and a "Follows you" badge when the listed user is following the current user.
 * Clicking the row navigates to the listed user's account page.
 */
const FollowInstance = ({ name, username, bio, avatar, userFollowingTarget, targetFollowingUser }: Omit<FollowInstance, "id">) => {

  // src must be defined
  const avatarSrc = avatar ? avatar : "user-avatar_yr4qhg";
  const { followText, onToggleFollow } = useFollow({username, userFollowingTarget});
  const router = useRouter();

  return (
    <div className='w-full px-3 py-5 flex flex-row items-start gap-2 hover:bg-gray-800 
    transition ease-out duration-400'
    onClick={() => router.push(`/${username}`)}>

      {/* Avatar */}
      <div className="relative w-13 h-13 rounded-full border-4 border-black 
      overflow-hidden bg-zinc-900">
        <CldImage
          width="56"
          height="56"
          src={avatarSrc}
          alt="User Avatar"
          crop="thumb"
          gravity="face"
          format="auto"
          quality="auto"
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Details */}
      <div className='flex-1 w-full flex flex-col gap-1'>
        <div className='w-full flex flex-row items-start gap-2'>
          {/* Name & Username */}
          <div className='w-full flex flex-col'>
            <span className='font-bold max-w-[80px] truncate 
            md:max-w-none md:whitespace-normal'>{name}</span>
            <div className='flex flex-row items-center gap-1'>
              <span className='max-w-[80px] truncate 
            md:max-w-none md:whitespace-normal'
            data-testid="username-in-list">@{username}</span>

              {/* "Follows You" Badge */}
              {targetFollowingUser &&
              <span className='p-1 bg-gray-800 text-xs'>Follows you</span>}
              

            </div>
          </div>

          {/* Follow Action & Menu */}
          <div className='flex-1 flex flex-row gap-2 items-center'>
            <Button variant={!userFollowingTarget ? "outline" : "secondary"}
              className={"flex-1 h-11 py-1 rounded-xl"}
               onClick={onToggleFollow}
               data-testid="follow-btn-in-list">
              {followText}
            </Button>
            <Ellipsis className='flex-1'></Ellipsis>
          </div>

        </div>

        {/* Bio */}
        <p className='text-base w-full'>{bio}</p>
      </div>
    </div>
  )
}

export default FollowInstance
