"use server"

import axios from "axios";

/**
 * Server action that sends a follow request to the backend for the given username.
 * Requires a valid access token to authorise the request.
 */
export const followUserRequest = async (usernameToFollow: string, token: string) => {
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL_LOCAL;
    const res = await axios.post(`${backendUrl}/api/v1/follow/${usernameToFollow}/follow`,
      {}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
    return { success: true, data: res.data };

  } catch (error: any) {
    const errorRes =
      error.response?.data || { message: "An error occured while registring follow on the user" };
    return { success: false, error: errorRes };
  }

}

/**
 * Server action that sends an unfollow request to the backend for the given username.
 * Requires a valid access token to authorise the request.
 */
export const unfollowUserRequest = async (usernameToUnfollow: string, token: string) => {
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL_LOCAL;
    const res = await axios.post(`${backendUrl}/api/v1/follow/${usernameToUnfollow}/unfollow`,
      {}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
    return { success: true, data: res.data };

  } catch (error: any) {
    const errorRes =
      error.response?.data || { message: "An error occured while registring unfollow on the user" };
    return { success: false, error: errorRes };
  }


}