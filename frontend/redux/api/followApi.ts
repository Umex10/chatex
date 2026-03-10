import { followUserRequest, unfollowUserRequest } from '@/actions/follow-system-user';
import { Follow } from '@/types/Follow';
import { User } from '@/types/User';
import { apiSlice } from './apiSlice';

/**
 * Follow-specific endpoints injected into the base API slice.
 * Handles follow/unfollow actions and retrieval of follower/following lists.
 */
const followApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
} = followApi;
