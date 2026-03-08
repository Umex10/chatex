"use client"

import React, { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname, useRouter } from 'next/navigation'
import ReturnHeader from '@/components/ReturnHeader'

/**
 * Layout for the followers/following/verifiedFollowers tab group of a user's account.
 * Renders a sticky return header and a set of tab triggers that navigate between the three lists.
 */
const Layout = ({ children }: Readonly<{
  children?: React.ReactNode
}>) => {
  const path = usePathname().split("/")
  const tab = path[2];
  const username = path[1];
  const [activeTab, setActiveTab] = useState(tab);
  const router = useRouter();

  return (
    <div className='flex flex-col' data-testid="follow-site">

      {/* Return Header */}
      <ReturnHeader returnText={username}></ReturnHeader>

      {/* Tab Navigation */}
      <Tabs defaultValue={activeTab} className="w-full"
       onValueChange={setActiveTab}>
        <TabsList className='bg-background w-full gap-1 h-14 p-0'>
          <TabsTrigger value="verified-followers"
            className={`flex-1 text-lg
                  ${activeTab === "verified-followers" ? "underline decoration-2 underline-offset-20" : ""}`}
                  onClick={() => router.push(`/${username}/verifiedFollowers`)}
                  data-testid="verified-followers-label">Verified Followers</TabsTrigger>
          <TabsTrigger value="followers"
            className={`flex-1 text-lg
                  ${activeTab === "followers" ? "underline decoration-2 underline-offset-20" : ""}`}
                  onClick={() => router.push(`/${username}/followers`)}
                  data-testid="followers-label">Followers</TabsTrigger>
          <TabsTrigger value="following"
            className={`flex-1 text-lg
                  ${activeTab === "following" ? "underline decoration-2 underline-offset-20" : ""}`}
                  onClick={() => router.push(`/${username}/following`)}
                  data-testid="following-label">Following</TabsTrigger>
        </TabsList>
        {/* Tab Content */}
        <TabsContent value="verified-followers" className='m-0 flex-1 sm:border'>{children}</TabsContent>
        <TabsContent value="followers" className='m-0 flex-1 sm:border'>{children}</TabsContent>
        <TabsContent value="following" className='m-0 flex-1 sm:border'>{children}</TabsContent>
      </Tabs>
    </div>
  )
}

export default Layout
