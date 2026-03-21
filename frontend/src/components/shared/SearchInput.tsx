"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Input } from '../ui/input'
import { Search } from "lucide-react";
import { useSearchFollowQuery, useSearchRecommendFollowsQuery } from '@redux/api/apis/followApi';
import FollowInstance from '../follow/FollowInstance';
import FollowInstanceSkeleton from '../follow/FollowInstanceSkeleton';
import { Skeleton } from '../ui/skeleton';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/use-chat';

interface SearchInputArgs {
  variant: "ACCOUNT" | "CHAT";
}

const SearchInput = ({ variant }: SearchInputArgs) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: searchedUsers, isLoading: isLoadingSearchedUsers } = useSearchFollowQuery(debouncedQuery, {
    skip: debouncedQuery.length < 2
  });
  const { data: recommendedUsers, isLoading: isLoadingRecommendedUsers } = useSearchRecommendFollowsQuery(debouncedQuery, {
    skip: debouncedQuery.length < 2
  });

  // Debouncing
  useEffect(() => {
    // Countdown
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    // Cleanup
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Handle clicking outside to close the search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside)

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Auto when user types something
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [searchQuery])

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={() => {
            if (searchQuery.trim().length > 0) setIsOpen(true)
          }}
          className={`block p-2.5 pl-10 w-full text-sm rounded-full border-none bg-secondary`}
          placeholder="Suche..."
        />
      </div>

      {/* Search Results Area - absolute so it floats above other content */}
      {isOpen && searchQuery.trim().length > 0 && (
        <div className='absolute left-0 mt-2 w-full flex flex-col bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50'>

          {/* 1. Search Suggestions Area (e.g. top 3 suggestions) */}
          <div className='flex flex-col p-3'>
            <span className='text-xs font-semibold text-muted-foreground mb-2'>Recommendations</span>

            {/* You can map your max 3 suggestions here */}
            <ul className='flex flex-col gap-2'>
              {isLoadingRecommendedUsers ? (
                <>
                  <Skeleton className="h-9 w-full rounded-md" />
                  <Skeleton className="h-9 w-full rounded-md" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </>
              ) : (
                <>
                  {recommendedUsers?.map(user => (
                    <li
                      key={user.username}
                      className='text-sm p-2 hover:bg-secondary rounded-md cursor-pointer'
                    >
                      {user.username}
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>

          {/* Separator line taking full width */}
          <div className='w-full border-t border-border'></div>

          {/* 2. Full Results Area */}
          <div className='flex flex-col p-3'>
            <span className='text-xs font-semibold text-muted-foreground mb-2'>Results</span>

            {/* You can map your detailed search results here (e.g. User list) */}
            <ul className='flex flex-col gap-2'>
              {isLoadingSearchedUsers ? (
                <>
                  <FollowInstanceSkeleton />
                  <FollowInstanceSkeleton />
                  <FollowInstanceSkeleton />
                </>
              ) : (
                searchedUsers?.map(user => (
                  <li key={user.username} onClick={(e) => setIsOpen(false)}>
                    <FollowInstance userData={user} variant={variant}></FollowInstance>
                  </li>
                ))
              )}
            </ul>
          </div>

        </div>
      )}
    </div>
  )
}

export default SearchInput
