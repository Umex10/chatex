"use client"

import { fetchUser } from "@/actions/user";
import { setUser } from "@redux/slices/userSlice";
import { AppDispatch, RootState } from "@redux/store"
import { useEffect } from "react";
import { useDispatch, UseDispatch, useSelector } from "react-redux"

export const UserProvider = ({ children }: { children: React.ReactNode }) => {

  const dispatch: AppDispatch = useDispatch();

  const user = useSelector((state: RootState) => state.userState);


  useEffect(() => {

    async function init() {

      if (user) {
        return;
      }

      const res = await fetchUser();

      if (!res.success) return;

      dispatch(setUser(res.data));
    }

    init();

  }, [])

  return (
    <>{children}</>
  )

}