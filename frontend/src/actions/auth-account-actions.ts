"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { SignUpAccountValues } from "@/components/signup-account";
import { SignInAccountValues } from "@/components/signin-account";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth`,
  headers: {
    "Content-Type": "application/json",
  }
});

export async function signUpAccount(formData: Omit<SignUpAccountValues, "keyConfirm">) {
  try {
    const res = await api.post("/sign-up", formData);

    const setCookieHeader = res.headers["set-cookie"];

    if (setCookieHeader) {
      await setRefreshCookie(setCookieHeader);
    }

    return { success: true, data: res.data };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An error occurred while signing up the account";

    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function signInAccount(formData: SignInAccountValues) {
  try {
    const res = await api.post("/sign-in", formData);

    const setCookieHeader = res.headers["set-cookie"];
    if (setCookieHeader) {
      await setRefreshCookie(setCookieHeader);
    }

    return { success: true, data: res.data };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "An error occurred while signing in the account";

    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }
}

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
