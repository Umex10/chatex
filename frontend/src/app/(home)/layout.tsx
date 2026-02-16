/* eslint-disable @next/next/no-img-element */
"use client"

import AccessJwtProvider from '@/components/AccessJwtProvider'
import React from 'react'

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"

import { CustomTrigger } from '@/components/CustomTrigger'
import { Button } from '@/components/ui/button'

import { Award } from "lucide-react";
import NavMenu from '@/components/NavMenu'

/**
 * Layout component for authenticated pages.
 * Wraps children with the AccessJwtProvider to manage JWT token state.
 */
export const Layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {

  return (
    <AccessJwtProvider>
      <SidebarProvider>
        <AppSidebar />

          <SidebarInset>
            <div className='min-h-screen w-full flex flex-col gap-10
             px-4 pt-4'>

              <header className='w-full flex flex-row justify-between
               items-center min-w-0 md:hidden' aria-label='banner'>

                <div className='w-1/5 flex justify-start md:hidden'>
                  <CustomTrigger />
                </div>
 
                <div className='flex-1 flex justify-center'>
                  <img
                    src="/chatex4.png"
                    width={50}
                    height={70}
                    alt="Chatex Logo"
                    className="w-10 h-10"
                  />
                </div>

                <div className='w-1/5 flex justify-end'>
                  <Button variant="outline" className='p-2' size="icon">
                    <Award className='w-10 h-10'></Award>
                  </Button>
                </div>
              </header>

              <main className='w-full flex-1'>
                {children}
              </main>
            
              <aside className='hidden md:flex'>

              </aside>

              <footer className='w-full flex justify-center md:hidden'>
                  <NavMenu></NavMenu>
              </footer>
            </div>
          </SidebarInset>
      </SidebarProvider>
    </AccessJwtProvider>
  )
}

export default Layout
