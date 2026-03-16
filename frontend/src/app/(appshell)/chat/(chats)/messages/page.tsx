"use client"

import ChatInstance from '@/components/chat/ChatInstance'
import { useGetChatsQuery } from '@redux/api/chatApi'
import React from 'react'

const Page = () => {

  const { data: chats, isLoading } = useGetChatsQuery();

  return (
    <div>
   
        {chats?.map(chat => (
          <ChatInstance key={chat.username} chatId={chat.id} avatar={chat.avatar} name={chat.name}
            lastMessage={"LoL!"} 
            lastMessageCreatedAt="2026-03-03"></ChatInstance>
        ))}    </div>
  )
}

export default Page
