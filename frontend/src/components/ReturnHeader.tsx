"use client"

import React from 'react'

import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface ReturnHeaderArgs {
  children?: React.ReactNode,
  returnText: string
}

/**
 * Sticky header component with a back-navigation button and an optional action slot on the right.
 * Used at the top of detail/settings pages so the user can return to the previous route.
 */
const ReturnHeader = ({children, returnText}: ReturnHeaderArgs) => {

  const router = useRouter();

  return (
    <div className='flex flex-row items-center 
     sticky w-full z-50 left-0 top-0 bg-black p-4'>
      <div className='flex-1 flex flex-row items-center'>
        <div className='flex-1 flex flex-row items-center gap-10'>
          {/* Back Button */}
          <Button
            className="bg-transparent [&_svg]:!size-6 px-0"
            onClick={() => router.back()}
            aria-label="Zurück"
            data-testid="return-btn"
          >
            <ArrowLeft/>
          </Button>
          {/* Title */}
          <h2 className='font-bold text-lg'>{returnText}</h2>
        </div>
      </div>
      {/* Action Slot */}
      <div className=''>
        {children}
      </div>
    </div>
  )
}

export default ReturnHeader
