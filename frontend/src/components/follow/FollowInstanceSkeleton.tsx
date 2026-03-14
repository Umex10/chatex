import React from 'react'
import { Skeleton } from '../ui/skeleton'

const FollowInstanceSkeleton = () => {
  return (
    <div className='w-full px-3 py-5 flex flex-row items-start gap-2'>
      {/* Avatar Skeleton */}
      <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />

      {/* User Details Skeleton */}
      <div className='flex-1 w-full flex flex-col gap-2'>
        <div className='w-full flex flex-row items-start gap-2'>
          
          {/* Name & Username Skeleton */}
          <div className='w-full flex flex-col gap-1'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-3 w-16' />
          </div>

          {/* Follow Action Menu Skeleton */}
          <div className='flex-1 flex flex-row gap-2 items-center justify-end'>
            <Skeleton className='h-8 w-20 rounded-xl' />
            <Skeleton className='h-8 w-8' />
          </div>
        </div>

        {/* Bio Skeleton */}
        <div className='w-full flex flex-col gap-1 mt-1'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-3/4' />
        </div>
      </div>
    </div>
  )
}

export default FollowInstanceSkeleton