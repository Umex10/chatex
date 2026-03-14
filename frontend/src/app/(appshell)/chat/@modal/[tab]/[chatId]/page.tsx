"use client"
import React from 'react'
import ChatConversation, { ChatMessage } from '@/components/chat/ChatConversation'
import { useGetUserQuery } from '@redux/api/userApi';

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

const ChatInstancePage = ({ params }: { params: { tab: string, chatId: string } }) => {

  const { data: meUser } = useGetUserQuery();

  return (
    <div className='flex-1 h-full w-full'>
      <ChatConversation messages={dummyMessages} chatUser={meUser} />
    </div>
  )
}

export default ChatInstancePage
