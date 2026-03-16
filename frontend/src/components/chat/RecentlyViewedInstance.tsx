"use client"

import { useCreateChatMutation } from '@redux/api/chatApi'
import { CldImage } from 'next-cloudinary'
import { useRouter } from 'next/navigation'
import React from 'react'

interface RecommendationArgs {
  name: string
  username: string,
  avatar: string,
}

const RecentlyViewedUser = ({ name, username, avatar }: RecommendationArgs) => {

  const avatarSrc = avatar ? avatar : "user-avatar_yr4qhg";
  const router = useRouter();

  const [createChat] = useCreateChatMutation();

  const handleCreateChat = async () => {
    try {
      const res = await createChat(username).unwrap();

      router.push(`/chat/messages/${res.id}`);
    } catch (error: any) {
      const errorMessage = error?.message || "An error occurred while creating a new chat.";
      console.error(errorMessage);
    }
  }

  return (
    <div className='w-full py-2 flex flex-row items-center gap-2 hover:bg-gray-800 
    transition ease-out duration-400'
      onClick={() => handleCreateChat()}>

      {/* Avatar */}
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

      {/* User Details */}

      <div className='flex-1 w-full flex flex-row items-start gap-2'>
        {/* Name & Username */}
        <div className='w-full flex flex-col'>
          <span className='font-bold md:whitespace-normal'>{name}</span>
          <div className='flex flex-row items-center gap-1'>
            <span className='md:whitespace-normal'
            >@{username}</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default RecentlyViewedUser
