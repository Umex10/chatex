/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { SignUpAccountValues } from "@/components/signup-account";
import { SignInAccountValues } from "@/components/signin-account";

/**
 * Axios instance configured for authentication API calls.
 * Targets the backend authentication endpoints.
 */
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/auth",
  headers: {
    "Content-Type": "application/json",
  }
});

/**
 * Server action to handle user account creation.
 * Sends sign-up data to the backend and stores the refresh token as a cookie.
 *
 * @returns Promise with success status and data or error message
 */
export async function signUpAccount(formData: Omit<SignUpAccountValues, 'keyConfirm'>) {
  try {
    const res = await api.post("/sign-up", formData);

    const setCookieHeader = res.headers['set-cookie'];

    if (setCookieHeader) {
      await setCookie(setCookieHeader);
    }

    return { success: true, data: res.data };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An error occurred while signing up the account";

    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Server action to handle user sign-in.
 * Authenticates user credentials and stores the refresh token as a cookie.
 *
 * @returns Promise with success status and data or error message
 */
export async function signInAccount(formData: SignInAccountValues) {
  try {
    const res = await api.post("/sign-in", formData);

    const setCookieHeader = res.headers['set-cookie'];
    if (setCookieHeader) {
      await setCookie(setCookieHeader);
    }

    return { success: true, data: res.data };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "An error occurred while signing in the account";

    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Helper function to extract and store the refresh token cookie.
 * Parses the Set-Cookie header and stores the refresh token with appropriate settings.
 *
 * @returns Promise that resolves when cookie is set
 */
async function setCookie(setCookieHeader: string[]) {

  const cookieStore = await cookies();

  // Needed check, because the cookie could be stored with other cookies
  // in an array, but could also be a standalone string
  const refreshTokenCookie = Array.isArray(setCookieHeader)
    ? setCookieHeader.find(c => c.startsWith('refresh_jwt='))
    : setCookieHeader;

  if (refreshTokenCookie) {

    // Extract the token key=value
    const [nameValue, ...attributes] = refreshTokenCookie.split(';');
    
    // Extract only the value
    const [, value] = nameValue.split('=');

    cookieStore.set({
      name: 'refresh_jwt',
      value: value,
      httpOnly: true,
      secure: false,
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
      sameSite: 'lax'
    });
  }

}
