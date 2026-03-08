import React from 'react'
import { Shout } from '../../constants/Shout'
import Spinner from './Spinner'
import OneShout from './OneShout'

interface RenderShoutsArgs {
  isLoading: boolean,
  shouts: Shout[]
} 

const RenderShouts = ({isLoading, shouts}: RenderShoutsArgs) => {

  return (
    <div className='w-full h-full relative'>
      {isLoading && (
        <div className="absolute z-50 inset-3 pt-10 flex w-full items-center justify-center bg-transparent">
          <Spinner></Spinner>
        </div>
      )}

      {!isLoading && shouts.length === 0 && (
        <div className='p-3 w-full flex flex-col items-center'>
          <p>There are now shouts yet {":("}</p>
        </div>
      )}
      
      {shouts.map(shout => (
        <OneShout {...shout} key={shout.createdAt} />
      ))}
    </div>
  )
}

export default RenderShouts

