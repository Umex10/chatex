import { signInRequest, signUpRequest } from '@/actions/auth-account-actions';
import { refreshAuthSessionRequest } from '@/actions/auth-session-actions';
import { apiSlice } from './apiSlice';

/**
 * Auth-specific endpoints injected into the base API slice.
 * Handles sign-up, sign-in, and access token refresh via server actions.
 */
const authApi = apiSlice.injectEndpoints({
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
  }),
});

/**
 * After a sign-up or sign-in mutation succeeds, this helper updates the
 * `refreshAccessTk` cache entry with the returned auth data so the access
 * token is immediately available without triggering a separate request.
 */
async function updateAuthCache(arg: any, { dispatch, queryFulfilled }: any) {
  try {
    const { data } = await queryFulfilled;
    dispatch(
      authApi.util.updateQueryData('refreshAccessTk', undefined, (draft: any) => {
        Object.assign(draft, data);
      })
    )
  } catch (err) {

  }
}

export const {
  useRefreshAccessTkQuery,
  useSignUpMutation,
  useSignInMutation,
} = authApi;
