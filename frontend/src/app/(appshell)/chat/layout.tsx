"use client"

import { WebSocketProvider } from '@/components/chat/WebSocketProvider';
import { usePathname } from 'next/navigation';
import React from 'react'

import { useSelectedLayoutSegment } from 'next/navigation';

export default function ChatLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {

  // This will tell us if the modal is currently showing sth. or just the defualt
  // In order to show the chat on the mobile, and on md: on the right side
  const modalSegment = useSelectedLayoutSegment('modal');
  const isChatOpen = modalSegment !== null;

  return (
    <WebSocketProvider>
      <div className='w-full h-full flex flex-row overflow-hidden'>

        {/* ChatList */}
        <div className={`
          ${isChatOpen ? 'hidden md:block' : 'block'} 
          w-full md:w-[40%] md:border-r h-full
        `}>
          {children}
        </div>

        {/* Chat */}
        <div className={`
          ${isChatOpen ? 'block' : 'hidden'} 
          md:flex w-full md:w-[60%] h-full
        `}>
          {modal}
        </div>

      </div>
    </WebSocketProvider>
  );
}
