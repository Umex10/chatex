import { Shout } from '@/types/Shout';
import { Follow } from '@/types/Follow';
import { CreateShoutPlayoad } from '@/app/(appshell)/home/page';
import { apiSlice } from './apiSlice';
import { CreateCommentPayload } from '@/app/(appshell)/(account)/[username]/[shoutId]/page';

/**
 * Shout-specific endpoints injected into the base API slice.
 * Handles shout CRUD operations and user engagement actions
 * (likes, re-shouts, and their removal).
 */
const shoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // QUERIES
    // ==========================================

    /** Fetches a single shout by username and shout ID. */
    getShout: builder.query<Shout, { username: string; shoutId: string }>({
      query: ({ username, shoutId }) => `/shout/${username}/${shoutId}`,
      providesTags: ['User']
    }),

    /** Fetches all shouts for a given username. */
    getShouts: builder.query<Shout[], string>({
      query: (username) => `/shout/${username}`,
      providesTags: ['User']
    }),

    /** Fetches all images for a given username. */
    getAllImages: builder.query<string[], string>({
      query: (username) => `/shout/${username}/images`,
      providesTags: ['User']
    }),

    /** Fetches all comments from a given Shout. */
    getComments: builder.query<Shout[], string>({
      query: (shoutId) => `/shout/${shoutId}/comment`,
      providesTags: ['User']
    }),

    /** Fetches the list of users who liked a specific shout. */
    getLikedBy: builder.query<Follow[], string>({
      query: (shoutId) => `/shout/${shoutId}/likedBy`
    }),

    /** Fetches all quotes for a given Shout. */
    getQuotes: builder.query<Shout[], string>({
      query: (shoutId) => `/shout/${shoutId}/quote`,
      providesTags: ['User']
    }),

    /** Fetches the list of users who re-shouted a specific shout. */
    getReShoutedBy: builder.query<Follow[], string>({
      query: (shoutId) => `/shout/${shoutId}/reShoutedBy`
    }),

    /** Fetches all comments created by a specific user. */
    getUserComments: builder.query<Shout[], string>({
      query: (username) => `/shout/${username}/userComment`,
      providesTags: ['User']
    }),

    // ==========================================
    // MUTATIONS
    // ==========================================

    /** Adds a comment on a shout. */
    commentOnShout: builder.mutation<Shout, CreateCommentPayload>({
      query: (createComment) => ({
        url: `/shout/${createComment.commentedShoutId}/comment`,
        method: "POST",
        body: createComment
      }),
      invalidatesTags: ['User']
    }),

    /** Creates a new shout post and invalidates the User cache. */
    createShout: builder.mutation<Shout, CreateShoutPlayoad>({
      query: (createShout) => ({
        url: `/shout`,
        method: "POST",
        body: createShout
      }),
      invalidatesTags: ['User']
    }),

    /** Deletes a shout by its ID and invalidates the User cache. */
    deleteShout: builder.mutation<void, string>({
      query: (shoutId) => ({
        url: `/shout/${shoutId}`,
        method: "DELETE"
      }),
      invalidatesTags: ['User']
    }),

    /** Removes a like from a shout. */
    dislikeTheShout: builder.mutation<void, string>({
      query: (shoutId) => ({
        url: `/shout/${shoutId}/dislike`,
        method: "POST"
      }),
    }),

    /** Sends a like action on a shout. */
    likeTheShout: builder.mutation<void, string>({
      query: (shoutId) => ({
        url: `/shout/${shoutId}/like`,
        method: "POST"
      }),
    }),

    /** Sends a quote action on a shout. */
    quoteTheShout: builder.mutation<void, CreateShoutPlayoad>({
      query: (createShout) => ({
        url: `/shout/${createShout.shoutId}/quote`,
        method: "POST",
        body: createShout
      }),
      invalidatesTags: ['User']
    }),

    /** Sends a re-shout action on a shout. */
    reShoutTheShout: builder.mutation<void, string>({
      query: (shoutId) => ({
        url: `/shout/${shoutId}/reShout`,
        method: "POST"
      }),
    }),

    /** Removes a quote from a shout. */
    unQuoteTheShout: builder.mutation<void, string>({
      query: (shoutId) => ({
        url: `/shout/${shoutId}/unQoute`,
        method: "POST"
      }),
      invalidatesTags: ['User']
    }),

    /** Removes a re-shout from a shout. */
    unShoutTheShout: builder.mutation<void, string>({
      query: (shoutId) => ({
        url: `/shout/${shoutId}/unShout`,
        method: "POST"
      }),
    }),
  }),
});

export const {
  // Queries
  useGetAllImagesQuery,
  useGetCommentsQuery,
  useGetLikedByQuery,
  useGetQuotesQuery,
  useGetReShoutedByQuery,
  useGetShoutQuery,
  useGetShoutsQuery,
  useGetUserCommentsQuery,

  // Mutations
  useCommentOnShoutMutation,
  useCreateShoutMutation,
  useDeleteShoutMutation,
  useDislikeTheShoutMutation,
  useLikeTheShoutMutation,
  useQuoteTheShoutMutation,
  useReShoutTheShoutMutation,
  useUnQuoteTheShoutMutation,
  useUnShoutTheShoutMutation,
} = shoutApi;
