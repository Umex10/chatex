import Shout from '@/components/Shout'
import React from 'react'

/**
 * Feed page component displaying the main content feed for authenticated users.
 */
const page = () => {
  return (
    <div className='text-3xl'>
      <Shout
      accImg='/acc.png'
      name='Fabrizio Roman'
      hasBadge={true}
      username='Fabrizio14'
      createdAt="1 std."
      desc="Mein erster Beitrag was looooooo
      Mein erster Beitrag was looooooo
      Mein erster Beitrag was looooooo"
      shoutImg='/stadion.jpg'
      comments={1000}
      reShouts={500}
      likes={10000}
      >

      </Shout>
       <Shout
      accImg='/acc.png'
      name='Fabrizio'
      hasBadge={true}
      username='Fabrizio14'
      createdAt="1 std."
      desc="Mein erster Beitrag was looooooo
      Mein erster Beitrag was looooooo
      Mein erster Beitrag was looooooo"
      shoutImg='/stadion.jpg'
      comments={1000}
      reShouts={500}
      likes={10000}
      >

      </Shout>
    </div>
  )
}

export default page
