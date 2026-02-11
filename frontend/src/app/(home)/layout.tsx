import AccessJwtProvider from '@/components/AccessJwtProvider'
import React from 'react'

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
