"use client"

import { useFollowUserMutation, useUnfollowUserMutation } from "@redux/api/followApi";
import { useEffect, useState } from "react";

/** Arguments accepted by the useFollow hook. */
interface UseFollowArgs {
  username: string,
  userFollowingTarget: boolean
}

/**
 * Custom hook managing the follow/unfollow toggle state for a given user.
 * Tracks the button label ("Follow" / "Following") and exposes a single
 * `onToggleFollow` handler that calls the correct mutation and rolls back
 * the optimistic label update on failure.
 */
export const useFollow = ({ username, userFollowingTarget }: UseFollowArgs) => {
  const [followText, setFollowText] = useState("Follow");

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFollowText(userFollowingTarget ? "Following" : "Follow");
  }, [userFollowingTarget]);


  /** Dispatches either a follow or unfollow mutation depending on the current state. */
  const onToggleFollow = async () => {
    if (userFollowingTarget) {
      await handleUnfollow();
    } else {
      await handleFollow();
    }
  };

  /** Optimistically sets the label to "Following" and calls the follow mutation. */
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


  /** Optimistically sets the label to "Follow" and calls the unfollow mutation. */
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