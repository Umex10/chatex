"use client"

import { Button } from '@/components/ui/button'
import { Search, Settings, MessageCirclePlus } from 'lucide-react'
import React, { useState } from 'react'
import { Tabs, TabsContent } from "@/components/ui/tabs"
import ReusableTabsList from '@/components/layout/ReusableTabsList'
import SearchUsersInput from '@/components/shared/SearchInput'
import SearchChatsInput from '@/components/chat/SearchChatsInput'
import CreateChatDialog from '@/components/chat/CreateChatDialog'

const ChatPage = ({ children }: { children: React.ReactNode }) => {

  const [activeTab, setActiveTab] = useState("messages");

  return (
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
                onClick={() => {}}>
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
  )
}

export default ChatPage