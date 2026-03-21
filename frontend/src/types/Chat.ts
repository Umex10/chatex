import { Message } from "./Message";

export interface Chat {
  id: string,
  name: string,
  username: string,
  avatar: string,
  createdUserAt: string,
  lastMessage: Message,
  messages: Message[]
}

