"use client"

import { useChat } from '@/hooks/use-chat'
import { CldImage } from 'next-cloudinary'

interface RecommendationArgs {
  name: string
  username: string,
  avatar: string,
}

const RecentlyViewedUser = ({ name, username, avatar }: RecommendationArgs) => {

  const avatarSrc = avatar ? avatar : "user-avatar_yr4qhg";
  const {handleCreateChat} = useChat();

  return (
    <div className='w-full py-2 flex flex-row items-center gap-2 hover:bg-gray-800 
    transition ease-out duration-400'
      onClick={() => handleCreateChat(username)}>

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
