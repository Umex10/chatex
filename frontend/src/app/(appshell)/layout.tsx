"use client"

import AuthProvider from '@/components/auth/AuthProvider'
import React, { useEffect, useState } from 'react'

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/Sidebar"

import { CustomTrigger } from '@/components/layout/CustomTrigger'
import { Button } from '@/components/ui/button'

import NavMenu from '@/components/layout/NavMenu'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import SearchUsersInput from '@/components/shared/SearchInput'
const XL_BREAKPOINT = 1280

/**
 * Responsive app-shell layout for all authenticated pages.
 * Composes:
 * - AuthProvider for session/token management
 * - A collapsible sidebar (desktop) or slide-in drawer (mobile)
 * - A sticky top header bar on mobile screens
 * - A main content area that scrolls independently
 * - A fixed desktop right rail with search input and trending topics
 * - A fixed mobile bottom navigation bar
 *
 * The sidebar open state is driven by a breakpoint listener that collapses
 * the sidebar below 1280 px and expands it above that threshold.
 */

export const Layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pathname = usePathname();

  const isChatPage = pathname.startsWith('/chat');
  const isSearchPage = pathname.startsWith('/search');

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
    <AuthProvider>
      
      {/* controls desktop/tablet sidebar open/collapsed state */}
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div className='w-full max-w-[1400px] flex mx-auto relative'>
          <AppSidebar />

          {/* content area that sits next to the sidebar */}
          <SidebarInset>
            {/* full-height app shell wrapper (mobile-first layout) */}
            <div className='flex overflow-hidden flex-col md:gap-4 w-full md:flex-row md:pl-4 h-dvh'>

              {/* mobile top header with trigger, logo and quick action */}
              <header className='flex z-50 flex-row justify-between items-center p-4 w-full min-w-0 border-b sm:hidden' aria-label='banner'>

                {/* left slot: opens/closes sidebar on mobile */}
                <div className='flex justify-start w-1/5 sm:hidden'>
                  <CustomTrigger></CustomTrigger>
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
                </div>
              </header>

              {/* main scroll container for page content */}
              <main className='overflow-y-auto overflow-x-hidden flex-1 min-w-0
               w-full min-h-0 pb-[61px] sm:pb-0 sm:border'>
                {children}
              </main>

              {/* desktop right rail with search and trends */}
              {!isChatPage && (
                <aside className='hidden sticky top-0 flex-col py-4 gap-4 h-screen lg:flex w-[350px]'>
                  {/* search input with left icon */}

                  {!isSearchPage ? (
                    <SearchUsersInput variant='ACCOUNT'></SearchUsersInput>
                  ) : (
                    <div className='h-1 w-full bg-violet-500 '></div>
                  )}

                  {/* trends section with list items and show-more action */}
                  <div className="relative">
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
                    {/* Coming Soon Badge Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="bg-black/70 text-white text-lg font-bold px-6 py-2 rounded-2xl shadow-lg" style={{backdropFilter: 'blur(2px)'}}>Coming Soon</span>
                    </div>
                  </div>

                  <div className="relative">
                    <section className="overflow-hidden rounded-2xl bg-secondary/50 mt-4">
                      <h2 className="py-3 px-4 text-xl font-extrabold">Trends for you</h2>
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
                    {/* Coming Soon Badge Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="bg-black/70 text-white text-lg font-bold px-6 py-2 rounded-2xl shadow-lg" style={{backdropFilter: 'blur(2px)'}}>Coming Soon</span>
                    </div>
                  </div>
                </aside>
              )}
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
    </AuthProvider>


  )
}

export default Layout
