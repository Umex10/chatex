"use client"
import React from 'react'
import ChatConversation, { ChatMessage } from '@/components/chat/ChatConversation'
import { useGetUserQuery } from '@redux/api/userApi';
import { useGetChatQuery } from '@redux/api/chatApi';
import { usePathname } from 'next/navigation';
import { Chat } from '@/types/Chat';

const dummyMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'dazn',
    createdAt: new Date().toISOString(),
    username: 'Me',
    avatar: 'user-avatar_yr4qhg',
    isMe: true
  }
]

const ChatInstancePage = () => {

  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const chatId = segments[segments.length - 1];

  const { data: chatUser } = useGetChatQuery(chatId);

  const { lastMessage, ...userData } = { ...chatUser };

  // Ensure all required fields are present and fallback to empty string if missing
  const safeUserData = {
    id: userData.id ?? '',
    name: userData.name ?? '',
    username: userData.username ?? '',
    avatar: userData.avatar ?? '',
    createdUserAt: userData.createdUserAt ?? '',
  };

  return (
    <div className='flex-1 h-full w-full'>
      <ChatConversation messages={dummyMessages} chatUser={safeUserData} />
    </div>
  )
}

export default ChatInstancePage