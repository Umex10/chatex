"use client"

import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton loader for OneShout component.
 * Displays animated placeholder while shout data is loading.
 */
export function ShoutInstanceSkeleton() {
  return (
    <div className='relative p-3 w-full border-y'>
      {/* row layout: avatar column + content column */}
      <div className='flex flex-row gap-2 pt-1'>
        {/* left column: avatar skeleton */}
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />

        {/* right column: content skeleton */}
        <div className='flex flex-col flex-1 gap-2 items-start'>
          {/* meta row: name, username, time */}
          <div className='w-full flex flex-row gap-2'>
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>

          {/* text skeleton */}
          <div className='flex flex-col gap-1 w-full'>
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-5/6 h-5" />
          </div>

          {/* image skeleton (optional) */}
          <Skeleton className="w-full h-48 rounded-2xl" />

          {/* engagement stats skeleton */}
          <div className='w-full grid grid-cols-4 items-center gap-2 mt-2'>
            <Skeleton className="w-12 h-5" />
            <Skeleton className="w-12 h-5" />
            <Skeleton className="w-12 h-5" />
            <Skeleton className="w-12 h-5" />
          </div>
        </div>
      </div>
    </div>
  )
}
