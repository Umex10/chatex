/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import axios from "axios"
import { cookies } from "next/headers";

/**
 * Server action to fetch a new access JWT token using the refresh token.
 * Retrieves the refresh token from cookies and requests a new access token from the backend.
 *
 * @returns Promise with success status and token data or error message
 */
export async function fetchAccessJwt() {

  try {

    const cookieStore = await cookies();
    const refreshCookie = cookieStore.get("refresh_jwt");

    const res = await axios.get("http://localhost:8080/api/v1/auth/access-jwt", {
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