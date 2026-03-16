interface Message {

  text: string,
  createdAt: string,
  read: boolean,
  userSide: "ME" | "CHAT_USER"

}

export interface Chat {
  id: string,
  name: string,
  username: string,
  avatar: string,
  createdUserAt: string,
  lastMessage: Message
}