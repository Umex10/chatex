import React from 'react'
import { Shout } from '@/types/Shout'
import Spinner from '../shared/Spinner'
import OneShout from './OneShout'
import { OneShoutSkeleton } from './OneShoutSkeleton'

/** Props for the RenderShouts component. */
interface RenderShoutsArgs {
  isLoading: boolean,
  shouts: Shout[]
} 

/**
 * Renders a list of shout cards with skeleton loaders while loading and an empty-state message.
 */
const RenderShouts = ({isLoading, shouts}: RenderShoutsArgs) => {

  return (
    <div className='w-full h-full'>
      {/* Loading state: display skeleton cards */}
      {isLoading && (
        <div>
          {[...Array(5)].map((_, i) => (
            <OneShoutSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}
      
      {/* Loaded state: display actual shout cards */}
      {!isLoading && shouts.map((shout, index) => (
        <OneShout {...shout} key={shout.createdAt + index} />
      ))}
    </div>
  )
}

export default RenderShouts

