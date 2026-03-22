"use client"

import { useState, useEffect, useRef } from 'react'
import { Input } from '../ui/input'
import { Search } from "lucide-react";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@redux/store';
import { setSearchText } from '@redux/api/slices/searchChatSlice';

const SearchChatsInput = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  // Auto when user types something
  useEffect(() => {

    dispatch(setSearchText(searchQuery))

  }, [searchQuery, dispatch])

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
          className={`block p-2.5 pl-10 w-full text-sm rounded-full border-none bg-secondary`}
          placeholder="Search..."
        />
      </div>
    </div>
  )
}

export default SearchChatsInput
