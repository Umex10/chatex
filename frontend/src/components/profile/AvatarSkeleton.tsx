"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface AvatarSkeletonProps {
  /** Size of the avatar. Defaults to "md". */
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16"
}

/**
 * Skeleton loader for Avatar component.
 * Displays animated circular placeholder while avatar image is loading.
 */
export function AvatarSkeleton({ size = "md" }: AvatarSkeletonProps) {
  return <Skeleton className={`${sizeMap[size]} rounded-full flex-shrink-0`} />
}
