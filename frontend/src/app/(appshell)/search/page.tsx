"use client"

import SearchInput from '@/components/shared/SearchInput'
import React from 'react'

const SearchPage = () => {
  return (
    <div className='w-full'>
      <div className='w-full flex flex-col p-3'>
        <div className='w-full relative z-10'>
          <SearchInput />
        </div>

        <div className='pt-3 mx-auto text-muted-foreground'>
          No listener
        </div>
      </div>
    </div>
  )
}

export default SearchPage
