import React from 'react'
import { Follow } from '@/types/Follow'
import FollowInstance from './FollowInstance'
import { Skeleton } from "@/components/ui/skeleton"

interface RenderFollowsArgs {
  list: Follow[],
  isLoading: boolean,
  variant: "ACCOUNT" | "CHAT"
}

const RenderFollowList = ({ list, isLoading, variant }: RenderFollowsArgs) => {
  return (
    <div className='w-full flex-1 border-y'>
      {/* Loading State with Skeleton */}
      {isLoading ? (
        <div className="flex flex-col">
          {[...Array(5)].map((_, i) => (
            <div key={`follow-skeleton-${i}`} className="flex flex-row gap-3 items-center p-4 border-b">
              <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-24 h-3" />
              </div>
              <Skeleton className="w-24 h-8 rounded-md" />
            </div>
          ))}
        </div>
      ) : (

        <ul className='flex flex-col gap-5'>

          {/* Following List */}
          {list && list.length > 0 ? (
            list.map(user => (
              <li key={user.username}>
                <FollowInstance userData={user} variant={variant} />
              </li>
            ))
          ) : (
            <div className="flex justify-center items-center py-10 text-muted-foreground border-b text-center">
              No follow accounts could be found.
            </div>
          )}
        </ul>
      )}
    </div>
  )
}

export default RenderFollowList
