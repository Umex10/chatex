"use client"

import { CldImage } from 'next-cloudinary'
import React from 'react'

interface AvatarArgs {
  avatar: string
}

/**
 * Reusable Avatar component for displaying a user's profile image.
 * Falls back to a default avatar if none is provided. Uses Cloudinary for image optimization.
 */
const Avatar = ({avatar}: AvatarArgs) => {
  return (
    <div className="w-14 h-14 bg-gray-200 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
      {/* Cloudinary Image Renderer */}
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
  )
}

export default Avatar
