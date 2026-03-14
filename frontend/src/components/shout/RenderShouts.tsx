import React from 'react'
import { Shout } from '@/types/Shout'
import Spinner from '../shared/Spinner'
import ShoutInstance from './ShoutInstance'
import { ShoutInstanceSkeleton } from './ShoutInstanceSkeleton'

/** Props for the RenderShouts component. */
interface RenderShoutsArgs {
  isLoading: boolean,
  shouts: Shout[]
}

/**
 * Renders a list of shout cards with skeleton loaders while loading and an empty-state message.
 */
const RenderShouts = ({ shouts, isLoading }: RenderShoutsArgs) => {

  return (
    <div className='w-full h-full'>
      {/* Loading state: display skeleton cards */}
      {isLoading && (
        <div>
          {[...Array(5)].map((_, i) => (
            <ShoutInstanceSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      {/* Loaded state: display actual shout cards */}
      {!isLoading && shouts && shouts.length > 0 && shouts.map((shout, index) => (
        <ShoutInstance {...shout} key={shout.createdAt + index} />
      ))}

      {/* Empty state: when no shouts exist */}
      {!isLoading && (!shouts || shouts.length === 0) && (
        <div className="flex justify-center items-center py-10 text-muted-foreground">
          No shouts found.
        </div>
      )}
    </div>
  )
}

export default RenderShouts

