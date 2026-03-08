"use client"

import { useGetUserQuery } from '@redux/api/userApi'
import { useRefreshAccessTkQuery } from '@redux/api/authApi'
import React from 'react'
import Loading from './Loading';

/**
 * Provider component that manages access JWT token fetching and state.
 * Automatically fetches and stores the access token (via Query) into the redux store
 */
const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const { isLoading: isLoadingTk,
    isSuccess: hasTk
  } = useRefreshAccessTkQuery(undefined);

  const {
    isLoading: isLoadingUser
  } = useGetUserQuery(undefined, { skip: !hasTk });

  if (isLoadingTk || (hasTk && isLoadingUser) ) {
    return <Loading></Loading>
  }

  return (
    <>{children}</>
  )
}

export default AuthProvider
