"use client"

import { WebSocketProvider } from '@/components/chat/WebSocketProvider';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button'
import {  MessageCirclePlus } from 'lucide-react'
import React, { useState } from 'react'
import { Tabs, TabsContent } from "@/components/ui/tabs"
import ReusableTabsList from '@/components/layout/ReusableTabsList'
import SearchChatsInput from '@/components/chat/SearchChatsInput'
import CreateChatDialog from '@/components/chat/CreateChatDialog'

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

  const path = usePathname();

  const segments = path.split('/').filter(Boolean);
  const tab = segments[segments.length - 2];

  const [activeTab, setActiveTab] = useState(
  tab === "messages" || tab === "requests" ? tab : "messages"
);

  return (
    <WebSocketProvider>
      <div className='w-full h-full flex flex-row overflow-hidden'>

        {/* ChatList */}
        <div className={`
          ${isChatOpen ? 'hidden md:block' : 'block'} 
          w-full md:w-[40%] md:border-r h-full
        `}>
          <div className='flex-1 h-full w-full flex flex-col'>

            {/* Header Form */}
            <div className='flex flex-row items-center justify-between px-4 py-3 gap-6'>

              <div className='flex flex-row items-center gap-3 flex-1 justify-end'>
                {/* Search Input */}
                <div className='w-full max-w-sm'>
                  <SearchChatsInput />
                </div>

                {/* Settings */}
                <div className='flex flex-row items-center gap-1'>
                  <CreateChatDialog>
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-secondary"
                      onClick={() => { }}>
                      <MessageCirclePlus className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </CreateChatDialog>
                </div>

              </div>

            </div>

            <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
              <ReusableTabsList
                activeTab={activeTab}
                tabs={[
                  {
                    value: "messages",
                    label: "Messages",
                    href: `/chat/messages`,
                    testId: ""
                  },
                  {
                    value: "requests",
                    label: "Requests",
                    href: `/chat/requests`,
                    testId: ""
                  },
                ]}
              />
              {/* Tab Content */}
              <TabsContent value="messages" className='m-0 flex-1 sm:border'>{children}</TabsContent>
              <TabsContent value="requests" className='m-0 flex-1 sm:border'>{children}</TabsContent>
            </Tabs>

          </div>
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
