"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { SignUpAccountValues } from "@/components/auth/signup-account";
import { SignInAccountValues } from "@/components/auth/signin-account";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL_LOCAL;

const api = axios.create({
  baseURL: `${BACKEND_URL}/api/v1/auth`,
  headers: {
    "Content-Type": "application/json",
  }
});

/**
 * Server action that registers a new user account.
 * Sends the form data to the backend sign-up endpoint and, on success,
 * persists the returned refresh JWT as an HTTP-only cookie.
 *
 * @returns An object with `success: true` and the auth response data on success,
 *          or `success: false` and the API error payload on failure.
 */
export async function signUpRequest(formData: Omit<SignUpAccountValues, "keyConfirm">) {
  try {
    console.log(api.getUri())
    console.log(api);
    const res = await api.post("/sign-up", formData);

    const setCookieHeader = res.headers["set-cookie"];

    if (setCookieHeader) {
      await setRefreshCookie(setCookieHeader);
    }

    return { success: true, data: res.data };
  } catch (error: any) {
    const errorRes =
      error.response?.data || {message: "An error occurred while signing up the account"};
    return { success: false, error: errorRes };
  }
}

/**
 * Server action that signs an existing user in.
 * Sends the credentials to the backend sign-in endpoint and, on success,
 * persists the returned refresh JWT as an HTTP-only cookie.
 *
 * @returns An object with `success: true` and the auth response data on success,
 *          or `success: false` and the API error payload on failure.
 */
export async function signInRequest(formData: SignInAccountValues) {
  try {
    const res = await api.post("/sign-in", formData);

    const setCookieHeader = res.headers["set-cookie"];
    if (setCookieHeader) {
      await setRefreshCookie(setCookieHeader);
    }

    return { success: true, data: res.data };
  } catch (error: any) {
    const errorRes = 
    error.response?.data || {message: "An error occurred while signing in the account"};
    return { success: false, error: errorRes };
  }
}

/**
 * Server action that signs the current user out.
 * Deletes the refresh JWT cookie from the Next.js cookie store.
 */
export async function signOutRequest() {

  const cookieStore = await cookies();
  cookieStore.delete("refresh_jwt");
}


/**
 * Parses the `set-cookie` header returned by the backend and stores the
 * `refresh_jwt` value as an HTTP-only cookie in the Next.js cookie store.
 */
async function setRefreshCookie(setCookieHeader: string[]) {
  const cookieStore = await cookies();

  const refreshTokenCookie = Array.isArray(setCookieHeader)
    ? setCookieHeader.find(c => c.startsWith("refresh_jwt="))
    : setCookieHeader;

  if (refreshTokenCookie) {
    const [nameValue] = refreshTokenCookie.split(";");
    const [, value] = nameValue.split("=");

    cookieStore.set({
      name: "refresh_jwt",
      value,
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax"
    });
  }
}
