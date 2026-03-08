import { User } from '../../constants/User';
import { AccountSchemaValues } from '@/components/SettingsForm';
import { apiSlice } from './apiSlice';

/**
 * User-specific endpoints injected into the base API slice.
 * Handles fetching the authenticated user, looking up profiles by username,
 * and updating user account data.
 */
const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetUserQuery,
  useGetUserByUsernameQuery,
  useUpdateUserMutation,
} = userApi;
