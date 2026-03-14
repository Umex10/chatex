"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Settings } from 'lucide-react'
import React, { useState } from 'react'
import { Tabs, TabsContent } from "@/components/ui/tabs"
import ReusableTabsList from '@/components/layout/ReusableTabsList'

const ChatPage = ({children} : {children: React.ReactNode}) => {

   const [activeTab, setActiveTab] = useState("messages");

  return (
    <div className='flex flex-col gap-2'>

      <div className='flex flex-row items-center px-2 md:py-2'>
        <h2 className='text-2xl font-bold flex-1'>Chat</h2>
        <Button variant="secondary" size="icon" className="flex justify-end
        bg-transparent w-12 h-12">
          <Settings />
        </Button>
      </div>

      <div className='flex flex-row items-center px-2 md:py-2'>
        <div className="relative flex-1">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            className="block p-6 pl-10 w-full text-base rounded-full border-none bg-secondary"
            placeholder="Suche..."
          />
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