"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Ellipsis, VolumeX } from 'lucide-react'
import { CldImage } from 'next-cloudinary'
import type { Follow } from '@/types/Follow'
import { useFollow } from '@/hooks/use-follow'
import { useRouter } from 'next/navigation'
import { useChat } from '@/hooks/use-chat'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/**
 * Renders a single user row in a follower or following list.
 * Shows the user's avatar, name, username, bio, a follow/unfollow toggle button,
 * and a "Follows you" badge when the listed user is following the current user.
 * Clicking the row navigates to the listed user's account page.
 */

interface FollowInstanceArgs {
  userData: Omit<Follow, "id">,
  variant: "ACCOUNT" | "CHAT";
}

const FollowInstance = ({ userData, variant }: FollowInstanceArgs) => {

  const { name, username, bio, avatar,
    userFollowingTarget, targetFollowingUser, userSilencingTarget,
    targetSilencingUser } = { ...userData };

  // src must be defined
  const avatarSrc = avatar ? avatar : "user-avatar_yr4qhg";
  const { followText, onToggleFollow } = useFollow({ username, userFollowingTarget });
  const router = useRouter();
  const { handleCreateChat } = useChat();
  const [showSilenceAlert, setShowSilenceAlert] = useState(false);

  return (
    <>
      <div className='w-full px-3 py-5 flex flex-row items-start gap-2 hover:bg-gray-800 
      transition ease-out duration-400 cursor-pointer'
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (variant === "ACCOUNT") {
            router.push(`/${username}`);
          } else if (variant === "CHAT") {

            /* Dont know if i will need it */
            // if (targetSilencingUser) {
            //   toast.error(`You cannot message @${username} right now. They have silenced you.`, {
            //     className: "toast-error"
            //   });
            //   return;
            // }

            // if (userSilencingTarget) {
            //   setShowSilenceAlert(true);
            //   return;
            // }

            handleCreateChat(username);

          }
        }}>

        {/* Avatar */}
        <div className="relative w-13 h-13 rounded-full border-4 border-black 
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
        <div className='flex-1 w-full flex flex-col gap-1'>
          <div className='w-full flex flex-row items-start gap-2'>
            {/* Name & Username */}
            <div className='w-full flex flex-col'>
              <div className='flex items-center gap-2'>
                <span className='font-bold max-w-[80px] truncate 
              md:max-w-none md:whitespace-normal'>{name}</span>
                {/* "You Silenced This User" Icon */}
                {userSilencingTarget && (
                  <VolumeX className="w-5 h-5 text-red-500" />
                )}
              </div>

              <div className='flex flex-row items-center gap-1 flex-wrap'>
                <span className='max-w-[80px] truncate 
            md:max-w-none md:whitespace-normal'
                  data-testid="username-in-list">@{username}</span>

                {/* "Follows You" Badge */}
                {targetFollowingUser &&
                  <span className='p-1 bg-gray-800 text-xs rounded whitespace-nowrap'>Follows you</span>}

                {/* "Silenced You" Badge */}
                {targetSilencingUser &&
                  <span className='p-1 bg-gray-800 text-xs text-red-400 rounded whitespace-nowrap'>Silenced you</span>}

              </div>
            </div>

            {/* Follow Action & Menu */}
            {variant !== "CHAT" && (
              <div className='flex-1 flex flex-row gap-2 items-center'>
                <Button variant={!userFollowingTarget ? "outline" : "secondary"}
                  className={"flex-1 h-11 py-1 rounded-xl"}
                  onClick={onToggleFollow}
                  data-testid="follow-btn-in-list">
                  {followText}
                </Button>
                <Ellipsis className='flex-1'></Ellipsis>
              </div>
            )}

          </div>

          {/* Bio */}
          <p className='text-base w-full'>{bio}</p>
        </div>
      </div>

      {/* Confirmation Dialog for explicitly writing to a silenced user */}
      <Dialog open={showSilenceAlert} onOpenChange={setShowSilenceAlert}>
        <DialogContent 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
          <DialogHeader>
            <DialogTitle>Muted User</DialogTitle>
            <DialogDescription>
              You have silenced @{username}. Are you sure you want to start a chat with them despite silencing them?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowSilenceAlert(false);
            }}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                await handleCreateChat(username);
                setShowSilenceAlert(false); 
              } catch (err) {
                console.error(err);
              }
            }}>
              Write Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FollowInstance
