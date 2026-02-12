"use client"

import { fetchAccessJwt } from '@/actions/fetchAccessJwt'
import { setAccessJwtState } from '@redux/slices/accessJwtSlice'
import { AppDispatch, RootState } from '@redux/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/**
 * Provider component that manages access JWT token fetching and state.
 * Automatically fetches and stores the access token when the component mounts.
 */
const AccessJwtProvider = ({ children }: { children: React.ReactNode }) => {

  const dispatch: AppDispatch = useDispatch();
  const accessJwtState = useSelector((state: RootState) => state.accessJwtState);

  useEffect(() => {
    async function init() {

      // If an authentication was triggered earlier, we don't need to 
      // fetch the accessJwt again
      if (accessJwtState.accessJwt !== null) {
        return;
      }

      const res = await fetchAccessJwt();
      if (!res.success) {
        return;
      }

      console.warn(res.data);
      dispatch(setAccessJwtState(res.data));
    }
    init();
  }, [])

  return (
    <>{children}</>
  )
}

export default AccessJwtProvider
