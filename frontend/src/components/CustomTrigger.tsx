"use client"

import { useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"
import { Button } from "./ui/button"
import { useGetUserQuery } from "@redux/api/apiSlice"
import { CldImage } from "next-cloudinary"

/**
 * Sidebar trigger button displaying the current user's avatar.
 * Clicking it toggles the sidebar open or closed.
 * Only used on mobile screens inside the top header bar.
 */
export const CustomTrigger = () => {

  const { data: user, isLoading } = useGetUserQuery(undefined);
  const avatar = user?.avatar ? user?.avatar : "user-avatar_yr4qhg";
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      onClick={toggleSidebar}
      className="p-0 h-10 w-10 rounded-full overflow-hidden bg-transparent"
    >
      <CldImage
        width="80"
        height="80"
        src={avatar}
        alt="User Avatar"
        crop="thumb"
        gravity="face"
        className="h-full w-full object-cover"
      />
    </Button>
  )
}