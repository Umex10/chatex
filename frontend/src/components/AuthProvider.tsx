"use client"

import { refreshAuthSession } from '@/actions/auth-session-actions'
import { setAccessJwtState } from '@redux/slices/accessJwtSlice'
import { setUser } from '@redux/slices/userSlice'
import { AppDispatch, RootState } from '@redux/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/**
 * Provider component that manages access JWT token fetching and state.
 * Automatically fetches and stores the access token when the component mounts.
 */
const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const dispatch: AppDispatch = useDispatch();
  const accessJwtState = useSelector((state: RootState) => state.accessJwtState);

  useEffect(() => {
    async function init() {

      // If an authentication was triggered earlier, we don't need to 
      // fetch the accessJwt again
      if (accessJwtState.accessJwt !== null) {
        return;
      }

      const res = await refreshAuthSession();
      if (!res.success) {
        return;
      }

      const { accessJwt, expiresIn, name, username } = res.data;

      dispatch(setAccessJwtState({ accessJwt, expiresIn }));
      dispatch(setUser({ name, username }))
    }
    init();
  }, [])

  return (
    <>{children}</>
  )
}

export default AuthProvider
