import React from 'react'

const DefaultChatView = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center text-muted-foreground'>
      <span className='text-xl'>Chat</span>
      <p className='text-sm'>Select a chat to start messaging</p>
    </div>
  )
}

export default DefaultChatView