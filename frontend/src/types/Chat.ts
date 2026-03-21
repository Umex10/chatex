
export interface Chat {
  id: string,
  name: string,
  username: string,
  avatar: string,
  createdUserAt: string,
  lastMessage: Message,
  messages: Message[]
}

export interface Message {
  chatId: string,
  text: string,
  createdAt: string,
  read: boolean,
  senderUsername: string,
  receiverUsername: string

}