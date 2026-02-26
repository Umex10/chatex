
export interface Follow {
  id: string,
  name: string,
  username: string,
  avatar: string,
  bio: string,
  userFollowingTarget: boolean,
  targetFollowingUser: boolean
}