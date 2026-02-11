/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/auth",
  headers: {
    "Content-Type": "application/json"
  }
})

export async function fetchAccessJwt() {

  try {

    const res = await api.get("/accessJwt");

    return {success: true, data: res.data};

  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An error occured while fetching the access jwt token";

    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }

}