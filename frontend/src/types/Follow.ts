
/**
 * Represents a single user entry in a follower or following list.
 */
export interface Follow {
  /** Unique identifier for the user */
  id: string,
  /** Display name of the user */
  name: string,
  /** Username of the user */
  username: string,
  /** Avatar image URL */
  avatar: string,
  /** User biography */
  bio: string,
  /** Whether the current user follows this user */
  userFollowingTarget: boolean,
  /** Whether this user follows the current user */
  targetFollowingUser: boolean,
  /** Whether the current user is silencing this user */
  userSilencingTarget: boolean,
  /** Whether this user is silencing the current user */
  targetSilencingUser: boolean
}