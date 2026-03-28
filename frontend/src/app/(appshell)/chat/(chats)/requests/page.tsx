"use client"

import ChatInstance from '@/components/chat/ChatInstance'
import Spinner from '@/components/shared/Spinner'
import { Chat } from '@/types/Chat'
import { User } from '@/types/User'
import { useGetChatsQuery, useGetSilencedChatsQuery } from '@redux/api/apis/chatApi'
import { useGetUserQuery } from '@redux/api/apis/userApi'
import { RootState } from '@redux/store'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'


/**
 * Page component displays the list of silenced chats (requests).
 * Filters chats by search text and shows loading spinner if needed.
 */
const Page = () => {

  const { data: chats, isLoading } = useGetSilencedChatsQuery();
  const { data: me, isLoading: isLoadingUser } = useGetUserQuery();

  const searchText = useSelector((state: RootState) => state.searchChatState.searchText);

  const filteredChats: Chat[] = useMemo(() => {
    if (!chats) return [];

    if (!searchText) return chats;

    return chats.filter(chat => chat.name.toLowerCase().includes(searchText.toLowerCase()))
  }, [chats, searchText])

  return (
    <div className='relative'>

      {isLoading || isLoadingUser ? (
        <div className="absolute z-50 top-20 inset-0 flex w-full items-center justify-center bg-transparent">
          <Spinner></Spinner>
        </div>
      ) : (
        filteredChats.map(chat => (
          <ChatInstance key={chat.username} meUser={me ? me : {} as User} chatId={chat.id} avatar={chat.avatar} name={chat.name}
            lastMessage={chat.lastMessage} unseenMessages={chat.unseenMessages}></ChatInstance>
        ))
      )}

    </div>
  )
}

export default Page
