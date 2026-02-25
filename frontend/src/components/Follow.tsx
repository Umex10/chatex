"use client"

import React from 'react'
import { Button } from './ui/button'
import { Ellipsis } from 'lucide-react'
import { CldImage } from 'next-cloudinary'

interface FollowArgs {
  name: string
  username: string,
  bio: string,
  avatar: string,
}

const Follow = ({ name, username, bio, avatar }: FollowArgs) => {

  // src must be defined
  const avatarSrc = avatar ? avatar : "user-avatar_yr4qhg";

  return (
    <div className='flex flex-row items-start gap-2 hover:bg-gray-800 
    transition ease-out duration-400'>

      <div className="relative w-13 h-13 rounded-full border-4 border-black overflow-hidden bg-zinc-900">
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

      <div className='flex flex-col gap-1 flex-1'>
        <div className='w-full flex flex-row items-start gap-2'>
          <div className='w-full flex flex-col'>
            <span className='font-bold max-w-[80px] truncate 
            md:max-w-none md:whitespace-normal'>{name}</span>
            <div className='flex flex-row gap-1'>
              <span className='max-w-[80px] truncate 
            md:max-w-none md:whitespace-normal'>{username}</span>
              <span className='p-1 bg-gray-800 text-xs'>Follows you</span>
            </div>
          </div>

          <div className='flex flex-row gap-2 items-center'>
            <Button className='h-11 py-1 px-5 rounded-xl' variant="secondary">Follow back</Button>
            <Ellipsis className='flex-1'></Ellipsis>
          </div>

        </div>

        <p className='text-base w-full'>{bio}</p>
      </div>
    </div>
  )
}

export default Follow
