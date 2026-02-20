"use client"

import { useRefreshAccesstokenQuery } from '@redux/api/apiSlice'
import React, { useEffect } from 'react'

/**
 * Provider component that manages access JWT token fetching and state.
 * Automatically fetches and stores the access token when the component mounts.
 */
const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const { isLoading } = useRefreshAccesstokenQuery(undefined);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>{children}</>
  )
}

export default AuthProvider
