/**
 * Represents a user's public profile as returned by the backend API.
 * Used throughout the frontend to type user data fetched from the store or API responses.
 */
export interface User {
  /** Display name of the user */
  name: string,
  /** Unique username */
  username: string,
  /** ISO date string when the user was created */
  createdAt: string,
  /** Number of followers */
  followersCount: number,
  /** Number of users this user is following */
  followingCount: number,
  /** Whether the current user follows this user */
  userFollowingTarget: boolean,
  /** Avatar image URL */
  avatar: string,
  /** Banner image URL */
  banner: string,
  /** User biography */
  bio: string,
  /** User location */
  location: string,
  /** User website URL */
  website: string,
  /** Whether the current user is silencing this user */
  userSilencingTarget: boolean,
  /** Whether this user is silencing the current user */
  targetSilencingUser: boolean,
}