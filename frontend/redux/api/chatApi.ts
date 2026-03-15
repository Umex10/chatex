import { apiSlice } from './apiSlice';
import { Chat } from '@/types/Chat';

/**
 * Follow-specific endpoints injected into the base API slice.
 * Handles follow/unfollow actions and retrieval of follower/following lists.
 */
const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
   
    getChats: builder.query<Chat[], void>({
      query: () => `/chat`
    })
    
  }),
});

export const {
  useGetChatsQuery
} = chatApi;
