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
      /* provides auth context for all app shell pages */
      <AccessJwtProvider>
        {/* controls desktop/tablet sidebar open/collapsed state */}
        <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <div className='w-full sm:w-auto max-w-8xl flex mx-auto relative'>
          <AppSidebar />

          {/* content area that sits next to the sidebar */}
          <SidebarInset>
            {/* full-height app shell wrapper (mobile-first layout) */}
            <div className='flex overflow-hidden flex-col md:gap-4 w-full md:flex-row md:pl-4 h-dvh'>

              {/* mobile top header with trigger, logo and quick action */}
              <header className='flex z-50 flex-row justify-between items-center p-4 w-full min-w-0 border-b sm:hidden' aria-label='banner'>

                {/* left slot: opens/closes sidebar on mobile */}
                <div className='flex justify-start w-1/5 sm:hidden'>
                  <CustomTrigger />
                </div>

                {/* center slot: brand logo */}
                <div className='flex flex-1 justify-center'>
                  <Image
                    src="/chatex4.png"
                    width={50}
                    height={70}
                    alt="Chatex Logo"
                    className="w-10 h-10"
                  />
                </div>

                {/* right slot: quick action button */}
                <div className='flex justify-end w-1/5'>
                  <Button variant="default" className='p-2'>
                    Subscribe
                  </Button>
                </div>
              </header>

              {/* main scroll container for page content */}
              <main className='overflow-y-auto overflow-x-hidden flex-1 w-full min-h-0 pb-[61px] sm:pb-0
              min-w-[300px] max-w-[700px] sm:border'>
                {children}
              </main>

              {/* desktop right rail with search and trends */}
              <aside className='hidden sticky top-0 flex-col py-4 gap-4 h-screen lg:flex w-[350px]'>
                {/* search input with left icon */}
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    className="block p-2.5 pl-10 w-full text-sm rounded-full border-none bg-secondary focus:ring-primary"
                    placeholder="Suche..."
                  />
                </div>

                {/* trends section with list items and show-more action */}
                <section className="overflow-hidden rounded-2xl bg-secondary/50">
                  <h2 className="py-3 px-4 text-xl font-extrabold">Trends für dich</h2>

                  <div className="flex flex-col">
                    {[
                      { category: "Technologie · Trending", title: "#NextJS", posts: "12.5K Posts" },
                      { category: "Laufen · Trending", title: "Bundesliga", posts: "45K Posts" },
                      { category: "Wirtschaft · Trending", title: "Wahlen", posts: "120K Posts" },
                    ].map((trend, i) => (
                      <Button variant="outline" key={i} className="py-3 px-4 text-left transition hover:bg-secondary">
                        <p className="text-xs text-muted-foreground">{trend.category}</p>
                        <p className="font-bold">{trend.title}</p>
                        <p className="text-xs text-muted-foreground">{trend.posts}</p>
                      </Button>
                    ))}
                  </div>

                  <Button variant="secondary" className="py-4 px-4 w-full text-sm text-left text-primary hover:bg-secondary">
                    Mehr anzeigen
                  </Button>
                </section>

                   <section className="overflow-hidden rounded-2xl bg-secondary/50">
                  <h2 className="py-3 px-4 text-xl font-extrabold">Trends für dich</h2>

                  <div className="flex flex-col">
                    {[
                      { category: "Technologie · Trending", title: "#NextJS", posts: "12.5K Posts" },
                      { category: "Laufen · Trending", title: "Bundesliga", posts: "45K Posts" },
                      { category: "Wirtschaft · Trending", title: "Wahlen", posts: "120K Posts" },
                    ].map((trend, i) => (
                      <Button variant="outline" key={i} className="py-3 px-4 text-left transition hover:bg-secondary">
                        <p className="text-xs text-muted-foreground">{trend.category}</p>
                        <p className="font-bold">{trend.title}</p>
                        <p className="text-xs text-muted-foreground">{trend.posts}</p>
                      </Button>
                    ))}
                  </div>

                  <Button variant="secondary" className="py-4 px-4 w-full text-sm text-left text-primary hover:bg-secondary">
                    Mehr anzeigen
                  </Button>
                </section>
              </aside>

              {/* mobile bottom navigation that stays fixed on small screens */}
              <footer className='flex fixed right-0 bottom-0 left-0 z-50 justify-center 
            w-full border-t sm:hidden bg-background'>
                {/* tab navigation actions for mobile */}
                <NavMenu></NavMenu>
              </footer>
            </div>
          </SidebarInset>
              </div>
        </SidebarProvider>
      </AccessJwtProvider>


  )
}

export default Layout
