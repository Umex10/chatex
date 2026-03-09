import React from 'react'
import { Follow } from '../../constants/Follow'
import FollowInstance from './FollowInstance'

interface RenderFollowsArgs {
  list: Follow[],
  isLoading: boolean
}

const RenderFollowList = ({ list, isLoading }: RenderFollowsArgs) => {
  return (
    <div className='w-full flex-1 border-y'>
      {/* Loading State */}
      {isLoading ? (

        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      ) : (

        <div className='flex flex-col gap-5'>

          {/* Following List */}
          {list?.map(user => (
            <FollowInstance {...user} key={user.username} />
          ))}
        </div>
      )}
    </div>
  )
}

export default RenderFollowList
