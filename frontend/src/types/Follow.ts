
/** Represents a single user entry in a follower or following list. */
export interface Follow {
  id: string,
  name: string,
  username: string,
  avatar: string,
  bio: string,
  userFollowingTarget: boolean,
  targetFollowingUser: boolean,
  userSilencingTarget: boolean,
  targetSilencingUser: boolean
}