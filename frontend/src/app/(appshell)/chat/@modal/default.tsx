"use client"

import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

import CreateChatDialog from '@/components/chat/CreateChatDialog';

const DefaultChatView = () => {

  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-4'>

      <Mail className='w-30 h-30 rounded-full bg-violet-500 p-5'></Mail>

      <div className='w-full flex flex-col items-center'>
        <h3 className='text-5xl font-bold'>Chat</h3>
        <p className='text-xl text-center text-muted-foreground'>Select a chat or start a new chat in order to chatex!</p>
      </div>

      <CreateChatDialog>
        <Button variant="outline" className='bg-transparent text-xl'>
          New Chat
        </Button>
      </CreateChatDialog>

    </div>
  )
}

export default DefaultChatView