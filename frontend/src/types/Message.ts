/**
 * Represents a single message exchanged in a chat.
 */
export interface Message {
  /** The chat this message belongs to */
  chatId: string,
  /** The message text content */
  text: string,
  /** ISO date string when the message was created */
  createdAt: string,
  /** Whether the message has been seen by the receiver */
  seen: boolean,
  /** Username of the sender */
  senderUsername: string,
  /** Username of the receiver */
  receiverUsername: string
}