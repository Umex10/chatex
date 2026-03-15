"use client"

import { joinedShoutDate } from '@/utils/joinedDate'
import { CldImage } from 'next-cloudinary'
import React from 'react'

interface MessageArgs {
  avatar: string,
  name: string,
  lastMessage: string,
  lastMessageCreatedAt: string
}

const ChatInstance = ({ avatar, name, lastMessage, lastMessageCreatedAt }: MessageArgs) => {

  const avatarSrc = avatar ? avatar : "user-avatar_yr4qhg";

  return (
    <div className='px-3 py-5 w-full flex flex-row items-center gap-2 hover:bg-gray-800 
    transition ease-out duration-400'>

      <div className="relative w-15 h-15 rounded-full border-4 border-black 
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

      <div className='flex-1 w-full flex flex-col gap-1'>

        <div className='w-full flex flex-row items-start gap-2'>
          <p className='font-bold w-full flex-1 truncate md:whitespace-normal text-base'>
            {name}
          </p>

          <p className='text-base opacity-70'>
            {joinedShoutDate(lastMessageCreatedAt)}
          </p>
        </div>


        <div className='opacity-70 text-base'>
          You: {lastMessage}
        </div>
      </div>
    </div>
  )
}

export default ChatInstance
