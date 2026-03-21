"use client"

import ChatInstance from '@/components/chat/ChatInstance'
import { User } from '@/types/User'
import { useGetChatsQuery } from '@redux/api/apis/chatApi'
import { useGetUserQuery } from '@redux/api/apis/userApi'
import React from 'react'

const Page = () => {

  const { data: chats, isLoading } = useGetChatsQuery();
  const { data: me, isLoading: isLoadingUser } = useGetUserQuery();

  return (
    <div>
      {chats?.map(chat => (
        <ChatInstance key={chat.username} meUser={me ? me : {} as User} chatId={chat.id} avatar={chat.avatar} name={chat.name}
          lastMessage={chat.lastMessage}></ChatInstance>
      ))}
    </div>
  )
}

export default Page
