"use client"

import ChatInstance from '@/components/chat/ChatInstance'
import React from 'react'

const page = () => {
  return (
    <div>
      <ChatInstance avatar='' name='Max' lastMessage='Lol!'
      lastMessageCreatedAt='2026-03-03'></ChatInstance>
      <ChatInstance avatar='' name='Max' lastMessage='Lol!'
      lastMessageCreatedAt='2026-03-03'></ChatInstance>
      <ChatInstance avatar='' name='Max' lastMessage='Lol!'
      lastMessageCreatedAt='2026-03-03'></ChatInstance>
      <ChatInstance avatar='' name='Max' lastMessage='Lol!'
      lastMessageCreatedAt='2026-03-03'></ChatInstance>
      
    </div>
  )
}

export default page
