"use client"

import AccessJwtProvider from '@/components/AccessJwtProvider'
import React, { useEffect, useState } from 'react'

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"

import { CustomTrigger } from '@/components/CustomTrigger'
import { Button } from '@/components/ui/button'

import { Award, Search } from "lucide-react";
import NavMenu from '@/components/NavMenu'
import Image from 'next/image'

const XL_BREAKPOINT = 1280

/**
 * Layout component for authenticated pages.
 * Wraps children with the AccessJwtProvider to manage JWT token state.
 */

export const Layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {

  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= XL_BREAKPOINT)
    }
    handleResize()

    const mql = window.matchMedia(`(min-width: ${XL_BREAKPOINT}px)`)
    mql.addEventListener("change", handleResize)
    return () => mql.removeEventListener("change", handleResize)
  }, [])

  return (
    <AccessJwtProvider>
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <AppSidebar />

        <SidebarInset>
          <div className='min-h-screen w-full flex flex-col 
            md:flex-row gap-10
             px-4 pt-4 md:pl-10'>

            <header className='w-full flex flex-row justify-between
               items-center min-w-0 md:hidden' aria-label='banner'>

              <div className='w-1/5 flex justify-start md:hidden'>
                <CustomTrigger />
              </div>

              <div className='flex-1 flex justify-center'>
                <Image
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

            <aside className='hidden lg:flex w-[350px] flex-col gap-4 p-4 sticky top-0 h-screen'>
              {/* Suchleiste */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  className="block w-full p-2.5 pl-10 bg-secondary border-none rounded-full text-sm focus:ring-primary"
                  placeholder="Suche..."
                />
              </div>

              {/* Trends Sektion */}
              <section className="bg-secondary/50 rounded-2xl overflow-hidden">
                <h2 className="px-4 py-3 font-extrabold text-xl">Trends für dich</h2>

                <div className="flex flex-col">
                  {[
                    { category: "Technologie · Trending", title: "#NextJS", posts: "12.5K Posts" },
                    { category: "Laufen · Trending", title: "Bundesliga", posts: "45K Posts" },
                    { category: "Wirtschaft · Trending", title: "Wahlen", posts: "120K Posts" },
                  ].map((trend, i) => (
                    <Button variant="outline" key={i} className="px-4 py-3 hover:bg-secondary transition text-left">
                      <p className="text-xs text-muted-foreground">{trend.category}</p>
                      <p className="font-bold">{trend.title}</p>
                      <p className="text-xs text-muted-foreground">{trend.posts}</p>
                    </Button>
                  ))}
                </div>

                <Button variant="secondary" className="px-4 py-4 text-primary text-sm hover:bg-secondary w-full text-left">
                  Mehr anzeigen
                </Button>
              </section>
            </aside>

            <footer className='relative w-full flex justify-center md:hidden'>
              <div className="absolute top-0 -left-[16px] -right-[16px] h-[1px]
               bg-gray-200 dark:bg-gray-400" />
              <NavMenu></NavMenu>
            </footer>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AccessJwtProvider>
  )
}

export default Layout
