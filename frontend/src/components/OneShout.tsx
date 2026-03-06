import { LucideIcon } from 'lucide-react'

import { Repeat2, Heart, MessageCircle } from 'lucide-react';
import { Shout } from '../../constants/Shout';
import { CldImage } from 'next-cloudinary';
import { joinedShoutDate } from '@/utils/joinedDate';

/** Represents one engagement action (comment, reshout, like) with its icon, count and hover color. */
interface Action {
  Icon: LucideIcon,
  value: number,
  hoverColor: string,
  hoverBg: string,
}

/** Formats large numbers to short human-readable strings (e.g. 1500 → 1.5K). */
function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
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
      Icon: MessageCircle,
      value: 0,
      hoverColor: "group-hover:text-violet-400",
      hoverBg: "group-hover:bg-violet-400/10",
    },
    {
      Icon: Repeat2,
      value: reShouts,
      hoverColor: "group-hover:text-green-400",
      hoverBg: "group-hover:bg-green-400/10",
    },
    {
      Icon: Heart,
      value: likes,
      hoverColor: "group-hover:text-pink-500",
      hoverBg: "group-hover:bg-pink-500/10",
    },
  ]

  return (
    // outer card container for one shout item
    <div className='p-3 w-full border-y'>
      {/* row layout: avatar column + content column */}
      <div className='flex flex-row gap-2'>
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
        <div className='flex flex-col flex-1 gap-0 items-start'>
          {/* meta row: name, optional verified badge, username and time */}
          <div className='flex flex-row gap-1 items-center text-base'>
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

            <span className=''>{joinedShoutDate(createdAt)}</span>
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
            <ul className='w-full grid grid-cols-4 items-center -ml-2 mt-1'>
              {actions.map((action, i) => (
                <li key={i} className='group flex flex-row items-center gap-1 cursor-pointer select-none'>
                  <div className={`p-2 rounded-full transition-colors ${action.hoverBg}`}>
                    <action.Icon className={`w-[18px] h-[18px] text-zinc-500 transition-colors ${action.hoverColor}`} />
                  </div>
                  {action.value > 0 && (
                    <span className={`text-sm text-zinc-500 transition-colors ${action.hoverColor}`}>
                      {formatCount(action.value)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OneShout
