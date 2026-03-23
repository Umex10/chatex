"use client"

import { WebSocketProvider } from '@/components/chat/WebSocketProvider';
import { usePathname } from 'next/navigation';
import React from 'react'

const Layout = ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {

  const path = usePathname();
  const segment = path.split('/')[2];
  return (
    <WebSocketProvider>
      <div className='w-full h-full flex flex-row'>

        <div className='w-full md:w-[40%] md:border-x h-full'>
          {children}
        </div>

        <div className='hidden md:flex w-[60%] border-x h-full' key={path}>
          {modal}
        </div>
      </div>
    </WebSocketProvider>

  )
}

export default Layout
