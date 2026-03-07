
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
