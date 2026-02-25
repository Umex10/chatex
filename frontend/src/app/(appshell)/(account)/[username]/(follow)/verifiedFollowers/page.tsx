import Follow from '@/components/Follow'
import { twitterUsers } from '@/utils/dummy'
import React from 'react'

const page = () => {
  return (
    <div className='w-full flex-1 p-3 border-y'>
      <div className='flex flex-col gap-5'>
        {twitterUsers.map(user => (
          <Follow {...user} key={user.username}></Follow>
        ))}
      </div>

    </div>
  )
}

export default page
