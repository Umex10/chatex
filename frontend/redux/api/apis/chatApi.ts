import { apiSlice } from './apiSlice';
import { Chat } from '@/types/Chat';

/**
 * Follow-specific endpoints injected into the base API slice.
 * Handles follow/unfollow actions and retrieval of follower/following lists.
 */
export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
   
    getChats: builder.query<Chat[], void>({
      query: () => `/chat/chats`,
      providesTags: ['User']
    }),

     getSilencedChats: builder.query<Chat[], void>({
      query: () => `/chat/silencedChats`,
      providesTags: ['User']
    }),

    getChat: builder.query<Chat, string>({
      query: (chatId) => `/chat/${chatId}`
    }),

    createChat: builder.mutation<Chat, string>({
      query: (username) => ({
        url: `/chat/${username}`,
        method: 'POST'
      }),
      invalidatesTags: ['User']
    }),

    deleteChat: builder.mutation<void, string>({
      query: (username) => ({
        url: `/chat/${username}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    })
  }),
});

export const {
  useGetChatsQuery,
  useGetSilencedChatsQuery,
  useGetChatQuery,
  useCreateChatMutation,
  useDeleteChatMutation
} = chatApi;
