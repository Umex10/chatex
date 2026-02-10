"use server";
import axios from "axios";
import { SignUpAccountValues, SignInAccountValues } from "@/components/create-account-dialog";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function signUpAccount(formData: Omit<SignUpAccountValues, 'keyConfirm'>) {
  try {
    const res = await api.post("/sign-up", formData);
    console.log(res.data);
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
    console.log(res.data);
    return { success: true, data: res.data };
  } catch (error: any) {
    const errorMessage =
        error.response?.data?.message || "An error occurred while signing in the account";

    console.error(errorMessage);

    return { success: false, error: errorMessage };
  }
}
