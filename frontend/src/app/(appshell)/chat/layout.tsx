import { WebSocketProvider } from '@/components/chat/WebSocketProvider';
import React from 'react'

const layout = ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  return (
    <WebSocketProvider>
      <div className='w-full h-full flex flex-row'>

        <div className='w-full md:w-[40%] md:border-x h-full'>
          {children}
        </div>

        <div className='hidden md:flex w-[60%] border-x h-full'>
          {modal}
        </div>
      </div>
    </WebSocketProvider>

  )
}

export default layout
