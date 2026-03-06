import React from 'react'
import Image from 'next/image'
import { Badge } from './ui/badge'
import { BadgeCheck, icons, LucideIcon } from 'lucide-react'

import { Repeat2, Heart, MessageCircle } from 'lucide-react';
import { Shout } from '../../constants/Shout';
import { CldImage } from 'next-cloudinary';

/** Represents one engagement action (comment, reshout, like) with its icon and count. */
interface Action {
  Icon: LucideIcon,
  value: number
}

/**
 * Renders a single shout card with the author's avatar, name, optional verified badge,
 * username, timestamp, post text, media image and engagement action counters.
 */
const OneShout = (data: Shout) => {

  const { text, images, avatar, likes, reShouts, name, username, createdAt
  } = { ...data };

  const actions: Action[] = [
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
    <div className='p-3 w-full border-y'>
      {/* row layout: avatar column + content column */}
      <div className='flex flex-row gap-1'>
        {/* left column: account avatar */}
        <div className="w-14 h-14 bg-gray-200 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
          <CldImage
            width="56"
            height="56"
            src={avatar ? avatar : "user-avatar_yr4qhg"}
            alt="User Avatar"
            crop="thumb"
            gravity="face"
            format="auto"
            quality="auto"
            className="w-full h-full object-cover"
          />
        </div>
        {/* right column: meta info, text, media, actions */}
        <div className='flex flex-col flex-1 gap-1 items-start'>
          {/* meta row: name, optional verified badge, username and time */}
          <div className='flex flex-row gap-2 items-center text-base'>
            <span className='font-bold max-w-[80px] truncate 
            md:max-w-none md:whitespace-normal'>{name}</span>

            {/* verified badge only shown when hasBadge is true */}
            {/* {hasBadge && (
              <Badge
                variant="secondary"
                className="p-0 bg-transparent border-none shadow-none
                 hover:bg-transparent"
              >
                <BadgeCheck className="w-5 h-5 text-white" />
              </Badge>
            )} */}


            <span className='max-w-[80px] truncate 
            md:max-w-none md:whitespace-normal'>@{username}</span>

            <span>·</span>

            <span className=''>{createdAt}</span>
          </div>

          {/* body section: shout text, optional media, and engagement stats */}
          <div className='flex flex-col gap-2 items-start w-full'>
            {/* post text content */}
            <p className='text-lg'>{text}</p>
            {/* post image/media preview */}
            <ul className='w-full grid grid cols-2 items-center'>
              {images.map(image => (
                <li key={image} className="w-14 h-14 bg-gray-200 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
                  <CldImage
                    width="56"
                    height="56"
                    src={avatar ? avatar : "user-avatar_yr4qhg"}
                    alt="User Avatar"
                    crop="thumb"
                    gravity="face"
                    format="auto"
                    quality="auto"
                    className="w-full h-full object-cover"
                  />
                </li>
              ))}
            </ul>

            {/* action counters: comments, reshares and likes */}
            <ul className='flex flex-row gap-10 items-center w-full'>
              {actions.map((action) => (
                // one action item with icon + numeric count
                <div key={action.value} className='flex flex-row gap-1 items-center'>
                  <action.Icon className='w-8 h-8'></action.Icon>
                  <span className='text-base'>{action.value}</span>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OneShout
