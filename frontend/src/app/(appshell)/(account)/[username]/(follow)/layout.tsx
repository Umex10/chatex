"use client"

import React, { useState } from 'react'

import { Tabs, TabsContent } from "@/components/ui/tabs"
import ReusableTabsList from '@/components/layout/ReusableTabsList'
import { usePathname, useRouter } from 'next/navigation'
import ReturnHeader from '@/components/layout/ReturnHeader'

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
      <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
        <ReusableTabsList
          activeTab={activeTab}
          tabs={[
            {
              value: "verified-followers",
              label: "Verified Followers",
              href: `/${username}/verifiedFollowers`,
              testId: "verified-followers-label"
            },
            {
              value: "followers",
              label: "Followers",
              href: `/${username}/followers`,
              testId: "followers-label"
            },
            {
              value: "following",
              label: "Following",
              href: `/${username}/following`,
              testId: "following-label"
            }
          ]}
        />
        {/* Tab Content */}
        <TabsContent value="verified-followers" className='m-0 flex-1 sm:border'>{children}</TabsContent>
        <TabsContent value="followers" className='m-0 flex-1 sm:border'>{children}</TabsContent>
        <TabsContent value="following" className='m-0 flex-1 sm:border'>{children}</TabsContent>
      </Tabs>
    </div>
  )
}

export default Layout
