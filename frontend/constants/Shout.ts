
export interface Shout {
  id: string,
  name: string,
  username: string,
  avatar: string
  text: string,
  images: string[],
  likes: number,
  reShouts: number,
  createdAt: string
}
