"use client"
import React from 'react'
import ChatConversation from '@/components/chat/ChatConversation'
import { useGetChatQuery } from '@redux/api/apis/chatApi';
import { usePathname } from 'next/navigation';
import { useGetUserQuery } from '@redux/api/apis/userApi';

const ChatInstancePage = () => {

  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const chatId = segments[segments.length - 1];

  const { data: chat } = useGetChatQuery(chatId);
  const {data: meUser} = useGetUserQuery();

  if (!chat || !meUser) {
    return <p>Data needed!</p>;
  }

  const { id, lastMessage, messages, ...userData } = { ...chat };

  return (
    <div className='flex-1 h-full w-full'>
      <ChatConversation chatId={id} messages={messages} chatUser={userData} meUser={meUser} />
    </div>
  )
}

export default ChatInstancePage