import { Message } from "./Message";

/**
 * Represents a chat conversation between users.
 * Contains chat metadata and a list of messages.
 */
export interface Chat {
  /** Unique identifier for the chat */
  id: string,
  /** Display name of the chat or user */
  name: string,
  /** Username of the chat partner */
  username: string,
  /** Avatar image URL */
  avatar: string,
  /** ISO date string when the chat was created */
  createdUserAt: string,
  /** The most recent message in the chat */
  lastMessage: Message,
  /** All messages in the chat */
  messages: Message[]
}

