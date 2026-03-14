"use client"

import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton loader for ShoutComposer component.
 * Displays animated placeholder while user data is loading.
 */
export function ShoutComposerSkeleton() {
  return (
    <div className='flex flex-row gap-3'>
      {/* Avatar skeleton */}
      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />

      <div className="flex flex-col flex-1 gap-2 items-start w-full">
        {/* Text input skeleton */}
        <Skeleton className="w-full h-20 rounded-md" />

        {/* Image upload area skeleton */}
        <Skeleton className="w-full h-10 rounded-md" />

        {/* Toolbar skeleton */}
        <div className="w-full flex flex-row justify-between items-center mt-2">
          <div className="flex items-center gap-1">
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
          <Skeleton className="w-20 h-9 rounded-full" />
        </div>
      </div>
    </div>
  )
}
