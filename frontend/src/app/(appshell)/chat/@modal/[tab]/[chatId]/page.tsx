"use client"
import React from 'react'
import ChatConversation from '@/components/chat/ChatConversation'
import { useGetChatQuery } from '@redux/api/apis/chatApi';
import { usePathname } from 'next/navigation';
import { useGetUserQuery } from '@redux/api/apis/userApi';
import DefaultChatView from '../../default';
import { AppDispatch } from "@redux/store";
import { chatApi } from "@redux/api/apis/chatApi";
import { useDispatch } from 'react-redux';
import { Chat } from '@/types/Chat';

const ChatInstancePage = () => {

  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const chatId = segments[segments.length - 1];

  const dispatch = useDispatch<AppDispatch>();

  const { data: chat } = useGetChatQuery(chatId);

  // This will make sure that, when the user clicks on the chat, that the 
  // "unseen" messages resets to 0 
  dispatch(
    chatApi.util.updateQueryData('getChats', undefined, (draft: Chat[]) => {
      const chat = draft.find(c => c.id === chatId);
      if (chat) {
        chat.unseenMessages = 0;
      }
    })
  );

  const { data: meUser } = useGetUserQuery();

  if (!chat || !meUser) {
    return <DefaultChatView></DefaultChatView>;
  }

  const { id, lastMessage, messages, ...userData } = { ...chat };

  return (
    <div className='flex-1 h-full w-full'>
      <ChatConversation chatId={id} messages={messages} chatUser={userData} meUser={meUser} />
    </div>
  )
}

export default ChatInstancePage