import React from 'react'
import Image from 'next/image'
import { Badge } from './ui/badge'
import { BadgeCheck, icons, LucideIcon } from 'lucide-react'

import { Repeat2, Heart, MessageCircle } from 'lucide-react';


export interface ShoutData {
  accImg: string,
  name: string,
  hasBadge: boolean,
  username: string,
  createdAt: string,
  desc: string,
  shoutImg: string,
  comments: number,
  reShouts: number,
  likes: number
}

interface Action {
  Icon: LucideIcon,
  value: number
}

const Shout = (data: ShoutData) => {

  const { accImg, name, hasBadge, username, createdAt,
    desc, shoutImg, comments, reShouts, likes
  } = { ...data };

  const actions: Action[] = [
    {
      Icon: MessageCircle,
      value: comments

    },
    {
      Icon: Repeat2,
      value: reShouts

    },
    {
      Icon: Heart,
      value: likes
    }
  ]

  return (
    // outer card container for one shout item
    <div className='py-3 px-2 w-full border-y'>
      {/* row layout: avatar column + content column */}
      <div className='flex flex-row gap-1 max-w-[700px]'>
        {/* left column: account avatar */}
        <div className='w-1/8 flex justify-center'>
          <Image
            src={accImg}
            width={50}
            height={70}
            alt="Chatex Logo"
            className="w-10 h-10 rounded-full"
          />
        </div>
        {/* right column: meta info, text, media, actions */}
        <div className='flex flex-col flex-1 gap-1 items-start'>
          {/* meta row: name, optional verified badge, username and time */}
          <div className='flex flex-row gap-2 items-center text-sm'>
            <span className='font-bold max-w-[80px] truncate 
            md:max-w-none md:whitespace-normal'>{name}</span>

            {/* verified badge only shown when hasBadge is true */}
            {hasBadge && (
              <Badge
                variant="secondary"
                className="p-0 bg-transparent border-none shadow-none
                 hover:bg-transparent"
              >
                <BadgeCheck className="w-5 h-5 text-white" />
              </Badge>
            )}


            <span className='max-w-[80px] truncate 
            md:max-w-none md:whitespace-normal'>@{username}</span>

            <span>·</span>

            <span className=''>{createdAt}</span>
          </div>

          {/* body section: shout text, optional media, and engagement stats */}
          <div className='flex flex-col gap-2 items-start w-full'>
            {/* post text content */}
            <p className='text-base'>{desc}</p>
            {/* post image/media preview */}
            <Image
              src={shoutImg}
              width={600}
              height={400}
              alt="Chatex Logo"
              className="w-full md:max-w-90 rounded-xl h-90"
            />
            {/* action counters: comments, reshares and likes */}
            <ul className='flex flex-row gap-10 items-center w-full'>
              {actions.map((action) => (
                // one action item with icon + numeric count
                <div key={action.value} className='flex flex-row gap-1 items-center'>
                  <action.Icon className='w-4 h-4'></action.Icon>
                  <span className='text-sm'>{action.value}</span>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shout
