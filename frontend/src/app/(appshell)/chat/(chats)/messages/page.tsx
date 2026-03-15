"use client"

import ChatInstance from '@/components/chat/ChatInstance'
import { useGetChatsQuery } from '@redux/api/chatApi'
import React from 'react'

const Page = () => {

  const { data: chats, isLoading } = useGetChatsQuery();

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

      <ul>
        {chats?.map(chat => (
          <ChatInstance key={chat.username} avatar={chat.avatar} name={chat.name}
            lastMessage={chat.lastMessage.text} lastMessageCreatedAt={chat.lastMessage.createdAt}></ChatInstance>
        ))}
      </ul>


    </div>
  )
}

export default Page
