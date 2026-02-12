import AccessJwtProvider from '@/components/AccessJwtProvider'
import React from 'react'

/**
 * Layout component for authenticated pages.
 * Wraps children with the AccessJwtProvider to manage JWT token state.
 */
const layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <AccessJwtProvider>
      {children}
    </AccessJwtProvider>
  )
}

export default layout
