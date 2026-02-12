/**
 * @file Server action for refreshing the access JWT token.
 * Uses the stored refresh token cookie to obtain a fresh access token from the backend.
 */

"use server"

import axios from "axios"
import { cookies } from "next/headers";

/**
 * Server action to fetch a new access JWT token using the refresh token.
 * Retrieves the refresh token from cookies and requests a new access token from the backend.
 */
export async function fetchAccessJwt() {

  try {

    const cookieStore = await cookies();
    const refreshCookie = cookieStore.get("refresh_jwt");

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/access-jwt`, {
      headers: {
        "Content-Type": "application/json",
        "Cookie": `refresh_jwt=${refreshCookie?.value}`
      }
    });

    return { success: true, data: res.data };

  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An error occured while fetching the access jwt token";

    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }

}