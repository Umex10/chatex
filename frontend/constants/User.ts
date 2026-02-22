/**
 * Represents a user's public profile as returned by the backend API.
 * Used throughout the frontend to type user data fetched from the store or API responses.
 */
export interface User {
  name: string,
  username: string,
  createdAt: string,
  avatar: string,
  bio: string,
  location: string,
  website: string
}