"use client"

import { BadgeCheck, Ellipsis, Trash } from 'lucide-react'

import { Repeat2, Heart, MessageCircle } from 'lucide-react';
import { Shout } from '@/types/Shout';
import { CldImage } from 'next-cloudinary';
import { joinedShoutDate } from '@/utils/joinedDate';
import { Button } from '../ui/button';
import { useDeleteShoutMutation, useDislikeTheShoutMutation, useLikeTheShoutMutation, useReShoutTheShoutMutation, useUnShoutTheShoutMutation } from '@redux/api/shoutApi';
import Spinner from '../shared/Spinner';
import { MouseEvent, useState } from 'react';
import { Badge } from '../ui/badge';
import { EllipsisVertical, CircleEllipsis } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { CreateShout, ShoutComposer } from './CreateShout';
import { ReShoutMenu } from './ReShoutMenu';
import Avatar from '../profile/Avatar';
import { Activity } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';


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
    avatar, likesCount, reShoutsCount, commentsCount, name, username, createdAt,
    commentDto, quoteDto, variant } = data;

  const commentedShoutId = commentDto?.commentedShoutId;
  const commentedShoutUsername = commentDto?.commentedShoutUsername;

  const [likesCountView, setLikesCountView] = useState(likesCount);
  const [reShoutsCountView, setReShoutsCountView] = useState(reShoutsCount);
  const [commentsCountView, setCommentsCountview] = useState(commentsCount);

  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const isOnShoutPage = pathname.includes(id);

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

  function pushToAccount(e: React.MouseEvent<HTMLButtonElement | HTMLImageElement | HTMLSpanElement>) {
    router.push(`/${username}`);
    e.stopPropagation();
  }

  function handleImage(e: React.MouseEvent<HTMLDivElement>, imgUrl: string) {
    setImageUrl(imgUrl);
    setOpen(true);
    e.stopPropagation();
  }

  return (
    // outer card container for one shout item
    <div className={`relative p-3 w-full border-y transition ease-out duration-300 ${isOnShoutPage ? '' : 'cursor-pointer hover:opacity-80'
      }`}
      onClick={() => { if (!isOnShoutPage) router.push(`/${username}/${id}`); }}>

      {isLoading && (
        <div className="absolute z-50 inset-0 flex w-full items-center justify-center bg-transparent">
          <Spinner></Spinner>
        </div>
      )}

      <div className={`${!commentedShoutId || !commentedShoutUsername ? "hidden" : "w-full flex flex-row items-center gap-1"}`}
        onClick={(e) => {
          router.push(`/${commentedShoutUsername}/${commentedShoutId}`);
          e.stopPropagation();
        }}>
        <Activity className='w-4 h-4'></Activity>
        <span className='text-sm'>
          Commented on {" "}
          <span className='font-bold text-violet-400'>{commentedShoutUsername}</span>
          {" "} Shout
        </span>
      </div>

      {/* row layout: avatar column + content column */}
      <div className='flex flex-row gap-2 pt-1'>
        {/* left column: account avatar */}
        <Avatar avatar={avatar}></Avatar>
        {/* right column: meta info, text, media, actions */}
        <div className='flex flex-col flex-1 gap-0 items-start'>
          {/* meta row: name, optional verified badge, username and time */}
          <div className='w-full flex flex-row'>
            <div className='flex flex-row flex-1 gap-1 items-center text-base'>
              <span className='font-bold max-w-[80px] truncate 
            md:max-w-none md:whitespace-normal'
                onClick={(e) => { pushToAccount(e) }}>{name}</span>

              {/* verified badge only shown when hasBadge is true */}

              {/* Verified Badge */}
              <Badge
                variant="secondary"
                className="p-0 bg-transparent border-none shadow-none
                 hover:bg-transparent"
              >
                <BadgeCheck className="w-5 h-5 text-white" />
              </Badge>



              <span className='max-w-[80px] truncate 
            md:max-w-none md:whitespace-normal'
                onClick={(e) => { pushToAccount(e) }}>@{username}</span>

              <span>·</span>

              <span className=''>{joinedShoutDate(createdAt)}</span>
            </div>

            {/* Quick Action Buttons: Details, Delete, Re-Shout Info */}
            <div className='flex flex-row gap-1'>
              <Button size="icon" variant="secondary" className='bg-transparent'
                onClick={(e) => {
                  router.push(`/${username}/${id}/likedBy`);
                  e.stopPropagation();
                }}>
                <Ellipsis className="w-4 h-4" />
              </Button>

              <Button size="icon" variant="secondary" className='bg-transparent'
                onClick={(e) => {
                  deleteShout(id)
                  e.stopPropagation();
                }}>
                <Trash className="w-4 h-4" />
              </Button>

              <Button size="icon" variant="secondary" className='bg-transparent'
                onClick={(e) => {
                  router.push(`/${username}/${id}/reShoutedBy`);
                  e.stopPropagation();
                }}>
                <CircleEllipsis className="w-4 h-4" />
              </Button>
            </div>

          </div>


          {/* body section: shout text, optional media, and engagement stats */}
          <div className='flex flex-col gap-2 items-start w-full'>
            {/* post text content */}
            <p className='text-lg'>{text}</p>
            {/* post image/media preview — X-style adaptive grid */}
            {images.length > 0 && (
              <div className="w-full mt-1">
                {/* Single Image Layout */}
                {images.length === 1 && (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden"
                    onClick={(e) => handleImage(e, images[0])}>
                    <CldImage fill src={images[0]} alt="Post image 1" crop="fill" format="auto"
                      quality="auto" sizes="300px" className="object-cover" placeholder="blur"
                      blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${images[0]}`} />
                  </div>

                )}

                {/* Two Images Grid */}
                {images.length === 2 && (
                  <div className="grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden">
                    {images.map((img, i) => (
                      <div key={img} className="relative aspect-square"
                        onClick={(e) => handleImage(e, img)}>
                        <CldImage fill src={img} alt={`Post image ${i + 1}`} crop="fill" format="auto"
                          quality="auto" sizes="300px" className="object-cover" placeholder="blur"
                          blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${img}`} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Three Images Grid */}
                {images.length === 3 && (
                  <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-72 rounded-2xl overflow-hidden">
                    <div className="relative row-span-2"
                      onClick={(e) => handleImage(e, images[0])}>
                      <CldImage fill src={images[0]} alt="Post image 1" crop="fill" format="auto" quality="auto" sizes="300px" className="object-cover" placeholder="blur"
                        blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${images[0]}`} />
                    </div>
                    {images.slice(1).map((img, i) => (
                      <div key={img} className="relative"
                        onClick={(e) => handleImage(e, img)}>
                        <CldImage fill src={img} alt={`Post image ${i + 2}`} crop="fill"
                          format="auto" quality="auto" sizes="300px" className="object-cover"
                          placeholder="blur"
                          blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${img}`} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Four Images Grid */}
                {images.length === 4 && (
                  <div className="grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden">
                    {images.map((img, i) => (
                      <div key={img} className="relative aspect-square"
                        onClick={(e) => handleImage(e, img)}>
                        <CldImage fill src={img} alt={`Post image ${i + 1}`} crop="fill" format="auto" quality="auto" sizes="300px" className="object-cover" placeholder="blur"
                          blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${img}`} />
                      </div>
                    ))}
                  </div>
                )}

                <div onClick={(e) => e.stopPropagation()}>
                  <Dialog open={open} onOpenChange={() => setOpen(!open)}>

                    <DialogTitle></DialogTitle>

                    <DialogContent className='max-w-[95vw] min-h-[65vh] md:max-h-[95vh]'>

                      <CldImage fill src={imageUrl} alt="Post image 1" crop="fill" format="auto" quality="auto" sizes="95vw" className="object-cover h-full"
                        placeholder="blur"
                        blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${imageUrl}`} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}

            {!quoteDto && (
              /* action counters: reshouts and likes */
              /* Engagement Counters: Re-Shouts & Likes */
              <ul className='w-full grid grid-cols-4 items-center -ml-2 mt-1'>
                <li>
                  <div className='group inline-flex flex-row items-center gap-1 select-none'
                    onClick={(e) => e.stopPropagation()}>
                    {/* Re-Shout dropdown: Re-Shout or Quote */}
                    <ReShoutMenu
                      isReShouted={userReShoutingTheShoutView}
                      onReShout={handleReShoutTheShoutView}
                      quotedShout={{ quotedShoutId: id, name, username, avatar, text, createdAt, images }}
                    />
                    {reShoutsCountView > 0 && (
                      <span className={`text-sm transition-colors ${userReShoutingTheShoutView
                        ? 'text-green-400'
                        : 'text-zinc-500 group-hover:text-green-400'
                        }`}>
                        {formatCount(reShoutsCountView)}
                      </span>
                    )}
                  </div>
                </li>
                <li>
                  <div className='group inline-flex flex-row items-center gap-1 cursor-pointer select-none'
                    onClick={(e) => { e.stopPropagation(); handleLikeTheShoutView(); }}>
                    <div className='p-2 rounded-full transition-colors group-hover:bg-pink-500/10'>
                      <Heart
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
                  </div>
                </li>
                <li>
                  <div className='group inline-flex flex-row items-center gap-1 cursor-pointer select-none'
                    onClick={(e) => e.stopPropagation()}>
                    <div className='p-2 rounded-full transition-colors group-hover:bg-violet-400/10'>
                      <CreateShout variant='COMMENT' mainShoutId={id} incrementCommentCounter={setCommentsCountview}>
                        <MessageCircle
                          className={`w-[18px] h-[18px] transition-colors
                         text-zinc-500 group-hover:text-violet-400`}
                        />
                      </CreateShout>

                    </div>
                    {commentsCountView > 0 && (
                      <span className={`text-sm transition-colors
                     text-zinc-500 group-hover:text-violet-400`}>
                        {formatCount(commentsCountView)}
                      </span>
                    )}
                  </div>
                </li>
              </ul>
            )}


          </div>
        </div>
      </div>
    </div>
  )
}

export default OneShout
