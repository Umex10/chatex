import { signInRequest, signUpRequest } from '@/actions/auth-account-actions';
import { refreshAuthSessionRequest } from '@/actions/auth-session-actions';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../../constants/User';
import { AccountSchemaValues } from '@/components/SettingsForm';
import { followUserRequest, unfollowUserRequest } from '@/actions/follow-system-user';
import { Follow } from '../../constants/Follow';
import { Shout } from '../../constants/Shout';
import { ShoutPayload } from '@/app/(appshell)/home/page';


/**
 * After a sign-up or sign-in mutation succeeds, this helper updates the
 * `refreshAccessTk` cache entry with the returned auth data so the access
 * token is immediately available without triggering a separate request.
 */
async function updateAuthCache(arg: any, { dispatch, queryFulfilled }: any) {
  try {
    const { data } = await queryFulfilled;
    dispatch(
      apiSlice.util.updateQueryData('refreshAccessTk', undefined, (draft) => {
        Object.assign(draft, data);
      })
    )
  } catch (err) {

  }
}

/**
 * RTK Query API slice for the Chatex backend.
 * Handles authentication (sign-up, sign-in, token refresh) and user profile operations.
 * The `prepareHeaders` callback automatically injects the stored access JWT
 * into every request that requires authentication.
 */
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
      // get RootState
      const state = getState() as any;

      // Is there already a token?
      const token = state.api.queries['refreshAccessTk(undefined)']?.data?.accessJwt;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    }
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    /** Fetches a new access and refresh token from the backend using the refresh_jwt cookie. */
    refreshAccessTk: builder.query({
      async queryFn() {
        const res = await refreshAuthSessionRequest();

        if (!res.success) {
          return { error: res.error };
        }

        return { data: res.data };
      },
      keepUnusedDataFor: 900,
    }),

    /** Creates a new user account via the sign-up server action and caches the returned auth data. */
    signUp: builder.mutation({
      async queryFn(freshData) {
        const res = await signUpRequest(freshData);

        if (!res.success) return { error: res.error };
        return { data: res.data };
      },
      onQueryStarted: updateAuthCache,
    }),

    /** Authenticates an existing user via the sign-in server action and caches the returned auth data. */
    signIn: builder.mutation({
      async queryFn(freshData) {
        const res = await signInRequest(freshData);

        if (!res.success) return { error: res.error };
        return { data: res.data };
      },
      onQueryStarted: updateAuthCache,
    }),

    /** Fetches the currently authenticated user's profile. Provides the 'User' cache tag. */
    getUser: builder.query<User, void>({
      query: () => "/user",
      providesTags: ['User']
    }),

    /** Fetches a user's public profile by their username. */
    getUserByUsername: builder.query<User, string>({
      query: (username) => `/user/${username}`,
      providesTags: ['User']
    }),

    /** Sends a PATCH request to update the authenticated user's profile and invalidates the 'User' cache tag. */
    updateUser: builder.mutation<User, AccountSchemaValues>({
      query: (updatedData) => ({
        url: "/user",
        method: "PATCH",
        body: updatedData
      }),
      invalidatesTags: ['User']
    }),

    /** Sends a follow request for the given username via the follow server action. Invalidates the 'User' cache tag. */
    followUser: builder.mutation<void, string>({

      async queryFn(usernameToFollow, { getState }) {

        const state = getState() as any;
        const token = state.api.queries['refreshAccessTk(undefined)']?.data?.accessJwt;

        if (!token) {
          return { error: { message: "No access token found" } };
        }

        const res = await followUserRequest(usernameToFollow, token);

        if (!res.success) return { error: res.error };
        return { data: res.data };
      },
      invalidatesTags: ['User']
    }),

    /** Sends an unfollow request for the given username via the unfollow server action. Invalidates the 'User' cache tag. */
    unfollowUser: builder.mutation<User, string>({
      async queryFn(usernameToUnfollow, { getState }) {
        const state = getState() as any;
        const token = state.api.queries['refreshAccessTk(undefined)']?.data?.accessJwt;

        if (!token) {
          return { error: { message: "No access token found" } };
        }

        const res = await unfollowUserRequest(usernameToUnfollow, token);

        if (!res.success) return { error: res.error };
        return { data: res.data };
      },
      invalidatesTags: ['User']
    }),

    /** Fetches the list of followers for the given username. */
    getFollowers: builder.query<Follow[], string>({
      query: (username) => `/follow/${username}/followers`
    }),

    /** Fetches the list of accounts the given username is following. */
    getFollowing: builder.query<Follow[], string>({
      query: (username) => `/follow/${username}/following`
    }),

    getShouts: builder.query<Shout[], string>({
      query: (username) => `/shout/${username}`,
      providesTags: ['User']
    }),

    createShout: builder.mutation<Shout, ShoutPayload>({
       query: (createShout) => ({
        url: `/shout`,
        method: "POST",
        body: createShout
      }),
      invalidatesTags: ['User']
    }),

    deleteShout: builder.mutation<void, string>({
      query: (shoutId) => ({
        url: `/shout/${shoutId}`,
        method: "DELETE"
      }),
      invalidatesTags: ['User']
    }),

    likeTheShout: builder.mutation<void, string>({
      query: (shoutId) => ({
        url: `/shout/${shoutId}/like`,
        method: "POST"
      }),
    }),

    reShoutTheShout: builder.mutation<void, string>({
      query: (shoutId) => ({
        url: `/shout/${shoutId}/reShout`,
        method: "POST"
      }),
    }),
  }),
});


export const { useRefreshAccessTkQuery, useSignUpMutation,
  useSignInMutation, useGetUserQuery, useUpdateUserMutation,
  useGetUserByUsernameQuery, useFollowUserMutation, useUnfollowUserMutation,
  useGetFollowersQuery, useGetFollowingQuery, useGetShoutsQuery, useCreateShoutMutation,
  useDeleteShoutMutation, useLikeTheShoutMutation, useReShoutTheShoutMutation
} = apiSlice;