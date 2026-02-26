"use client"

import { useFollowUserMutation, useUnfollowUserMutation } from "@redux/api/apiSlice";
import { useEffect, useState } from "react";

interface UseFollowArgs {
  username: string,
  userFollowingTarget: boolean
}

export const useFollow = ({ username, userFollowingTarget }: UseFollowArgs) => {
  const [followText, setFollowText] = useState("Follow");

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFollowText(userFollowingTarget ? "Following" : "Follow");
  }, [userFollowingTarget]);


  const onToggleFollow = async () => {
    if (userFollowingTarget) {
      await handleUnfollow();
    } else {
      await handleFollow();
    }
  };

  async function handleFollow() {

    setFollowText("Following");

    try {

      await followUser(username).unwrap();

    } catch (error: any) {

      setFollowText("Follow");
      const errorMessage = error?.message || "An error occurred while following the user.";

      console.error(errorMessage, error);
    }
  }


  async function handleUnfollow() {

    setFollowText("Follow");

    try {

      await unfollowUser(username).unwrap();

    } catch (error: any) {

      setFollowText("Following");
      const errorMessage = error?.message || "An error occurred while unfollowing the user.";

      console.error(errorMessage, error);
    }
  }

  return { followText, onToggleFollow };
}