
/** Represents a single shout (post) entry with author info, content, and engagement metrics. */
export interface Shout {
  id: string,
  name: string,
  username: string,
  avatar: string
  text: string,
  images: string[],
  likesCount: number,
  reShoutsCount: number,
  userLikingTheShout: boolean, 
  userReShoutingTheShout: boolean
  createdAt: string
}
