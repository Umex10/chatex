"use client"

import Message from '@/components/chat/Message'
import React from 'react'

const page = () => {
  return (
    <div className='border-y'>
      <Message avatar='' name='Inter SC' lastMessage='Was get'
      lastMessageCreatedAt='2025-10-10'></Message>
    </div>
  )
}

export default page
