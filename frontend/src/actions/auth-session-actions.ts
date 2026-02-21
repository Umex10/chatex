"use server";

import axios from "axios";
import { cookies } from "next/headers";

export async function refreshAuthSession() {
  try {
    const cookieStore = await cookies();
    const refreshCookie = cookieStore.get("refresh_jwt");

    if (!refreshCookie) {
      return { success: false, error: "No refresh token found" };
    }

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/access-jwt`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_jwt=${refreshCookie.value}`
      },
      withCredentials: true
    });

    return { success: true, data: res.data };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An error occured while refreshing the auth session";

    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }
}
