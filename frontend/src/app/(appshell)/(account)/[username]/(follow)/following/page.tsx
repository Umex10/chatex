"use client"

import { twitterUsers } from '@/utils/dummy'
import { CldImage } from 'next-cloudinary'
import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { Ellipsis } from 'lucide-react';

const page = () => {
  return (
    <div className='w-full flex-1 px-3'>
      <div className='flex flex-col gap-3'>
        {twitterUsers.map(user => (
          <div key={user.username} className='flex flex-row gap-2'>

            <div className="relative w-14 h-14 rounded-full border-4 border-black overflow-hidden bg-zinc-900">
              <CldImage
                width="56"
                height="56"
                src={user.avatar}
                alt="User Avatar"
                crop="thumb"
                gravity="face"
                format="auto"
                quality="auto"
                className="w-full h-full object-cover"
              />
            </div>

            <div className='flex flex-col gap-1 flex-1'>
              <div className='w-full flex flex-row gap-1'>
                <div className='w-full flex flex-col'>
                  <span className='font-bold max-w-[80px] truncate 
            md:max-w-none md:whitespace-normal'>{user.name}</span>
                  <div>
                    <span className='max-w-[80px] truncate 
            md:max-w-none md:whitespace-normal'>{user.username}</span>
                    <span className='p-1 bg-gray-400 text-xs'>Follows you</span>
                  </div>
                </div>

                <Button className='rounded-xl' variant="secondary">Follow back</Button>
              </div>

              <p className='text-xs w-full'>{user.bio}</p>
            </div>

            <Ellipsis></Ellipsis>

          </div>
        ))}
      </div>

    </div>
  )
}

export default page
