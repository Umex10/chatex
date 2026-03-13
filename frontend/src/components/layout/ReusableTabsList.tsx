import React from 'react'
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation'

export interface TabItem {
  value: string;
  label: string;
  href: string;
  testId?: string;
}

interface ReusableTabsListProps {
  tabs: TabItem[];
  activeTab: string;
  gridCols?: number;
}

/**
 * Reusable TabsList component that maps over an array of tabs
 * and renders TabsTrigger buttons with custom styling for active states.
 */
const ReusableTabsList = ({ tabs, activeTab, gridCols }: ReusableTabsListProps) => {
  const router = useRouter();
  
  // To avoid Tailwind purging the dynamic class, we use an inline style or predefined classes.
  const gridClass = gridCols === 2 ? 'grid grid-cols-2' : gridCols === 3 ? 'grid grid-cols-3' : 'flex';

  return (
    <TabsList className={`bg-background w-full ${gridClass} gap-1 h-14 p-0`}>
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          data-testid={tab.testId}
          className={`flex-1 text-lg ${activeTab === tab.value ? "underline decoration-2 underline-offset-20" : ""}`}
          onClick={() => router.push(tab.href)}
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}

export default ReusableTabsList
