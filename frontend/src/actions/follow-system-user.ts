"use server"

import axios from "axios";

export const followUserRequest = async (usernameToFollow: string, token: string) => {
  
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/follow`,
      usernameToFollow, {
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

export const unfollowUserRequest = async (usernameToUnfollow: string, token: string) => {
  
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/unfollow`,
      usernameToUnfollow, {
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