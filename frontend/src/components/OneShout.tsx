import { Trash } from 'lucide-react'

import { Repeat2, Heart, MessageCircle } from 'lucide-react';
import { Shout } from '../../constants/Shout';
import { CldImage } from 'next-cloudinary';
import { joinedShoutDate } from '@/utils/joinedDate';
import { Button } from './ui/button';
import { useDeleteShoutMutation, useDislikeTheShoutMutation, useLikeTheShoutMutation, useReShoutTheShoutMutation, useUnShoutTheShoutMutation } from '@redux/api/apiSlice';
import Spinner from './Spinner';
import { useState } from 'react';

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

  const { id, text, images, userLikingTheShout, userReShoutingTheShout,
    avatar, likesCount, reShoutsCount, name, username, createdAt
  } = { ...data };

  const [likesCountView, setLikesCountView] = useState(likesCount);
  const [reShoutsCountView, setReShoutsCountView] = useState(reShoutsCount);

  const [userLikingTheShoutView, setUserLikingTheShoutView] = useState(userLikingTheShout);
  const [userReShoutingTheShoutView, setUserReShoutingTheShoutView] = useState(userReShoutingTheShout);

  const [likeShout] = useLikeTheShoutMutation();
  const [dislikeShout] = useDislikeTheShoutMutation();
  const [reShoutTheShout] = useReShoutTheShoutMutation();
  const [unShoutTheShout] = useUnShoutTheShoutMutation();

  const [deleteShout, { isLoading }] = useDeleteShoutMutation();

  function handleLikeTheShoutView() {

    if (userLikingTheShoutView) {
      setLikesCountView(last => last - 1);
      dislikeShout(id);

    } else {
      setLikesCountView(last => last + 1);
      likeShout(id);
    }

    setUserLikingTheShoutView(!userLikingTheShoutView);
  }

  function handleReShoutTheShoutView() {

    if (userReShoutingTheShoutView) {
      setReShoutsCountView(last => last - 1);
      unShoutTheShout(id);

    } else {
      setReShoutsCountView(last => last + 1);
      reShoutTheShout(id);
    }

    setUserReShoutingTheShoutView(!userReShoutingTheShoutView);
  }

  return (
    // outer card container for one shout item
    <div className='relative p-3 w-full border-y'>

      {isLoading && (
        <div className="absolute z-50 inset-0 flex w-full items-center justify-center bg-transparent">
          <Spinner></Spinner>
        </div>
      )}

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
          <div className='w-full flex flex-row'>
            <div className='flex flex-row flex-1 gap-1 items-center text-base'>
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

            <Button size="icon" variant="secondary" onClick={() => deleteShout(id)}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>


          {/* body section: shout text, optional media, and engagement stats */}
          <div className='flex flex-col gap-2 items-start w-full'>
            {/* post text content */}
            <p className='text-lg'>{text}</p>
            {/* post image/media preview — X-style adaptive grid */}
            {images.length > 0 && (
              <div className="w-full mt-1">
                {images.length === 1 && (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                    <CldImage fill src={images[0]} alt="Post image 1" crop="fill" format="auto" quality="auto" sizes="600px" className="object-cover" />
                  </div>
                )}

                {images.length === 2 && (
                  <div className="grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden">
                    {images.map((img, i) => (
                      <div key={img} className="relative aspect-square">
                        <CldImage fill src={img} alt={`Post image ${i + 1}`} crop="fill" format="auto" quality="auto" sizes="300px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {images.length === 3 && (
                  <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-72 rounded-2xl overflow-hidden">
                    <div className="relative row-span-2">
                      <CldImage fill src={images[0]} alt="Post image 1" crop="fill" format="auto" quality="auto" sizes="300px" className="object-cover" />
                    </div>
                    {images.slice(1).map((img, i) => (
                      <div key={img} className="relative">
                        <CldImage fill src={img} alt={`Post image ${i + 2}`} crop="fill" format="auto" quality="auto" sizes="300px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {images.length === 4 && (
                  <div className="grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden">
                    {images.map((img, i) => (
                      <div key={img} className="relative aspect-square">
                        <CldImage fill src={img} alt={`Post image ${i + 1}`} crop="fill" format="auto" quality="auto" sizes="300px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* action counters: reshouts and likes */}
            <ul className='w-full grid grid-cols-4 items-center -ml-2 mt-1'>
              <li className='group flex flex-row items-center gap-1 cursor-pointer select-none'>
                <div className='p-2 rounded-full transition-colors group-hover:bg-green-400/10'>
                  <Repeat2
                    onClick={handleReShoutTheShoutView}
                    className={`w-[18px] h-[18px] transition-colors ${userReShoutingTheShoutView
                      ? 'text-green-400'
                      : 'text-zinc-500 group-hover:text-green-400'
                      }`}
                  />
                </div>
                {reShoutsCountView > 0 && (
                  <span className={`text-sm transition-colors ${userReShoutingTheShoutView
                    ? 'text-green-400'
                    : 'text-zinc-500 group-hover:text-green-400'
                    }`}>
                    {formatCount(reShoutsCountView)}
                  </span>
                )}
              </li>
              <li className='group flex flex-row items-center gap-1 cursor-pointer select-none'>
                <div className='p-2 rounded-full transition-colors group-hover:bg-pink-500/10'>
                  <Heart
                    onClick={handleLikeTheShoutView}
                    fill={userLikingTheShoutView ? 'currentColor' : 'none'}
                    className={`w-[18px] h-[18px] transition-colors ${userLikingTheShoutView
                      ? 'text-pink-500'
                      : 'text-zinc-500 group-hover:text-pink-500'
                      }`}
                  />
                </div>
                {likesCountView > 0 && (
                  <span className={`text-sm transition-colors ${userLikingTheShoutView
                    ? 'text-pink-500'
                    : 'text-zinc-500 group-hover:text-pink-500'
                    }`}>
                    {formatCount(likesCountView)}
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OneShout
