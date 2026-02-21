import { signInAccount, signUpAccount } from '@/actions/auth-account-actions';
import { refreshAuthSession } from '@/actions/auth-session-actions';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../../constants/User';


// This will update the cache of an other route, so refreshAccessToken will not request 
// an accces token, if there is already one in the cache
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
    refreshAccessTk: builder.query({
      async queryFn() {
        const res = await refreshAuthSession();

        if (!res.success) {
          return { error: res.error };
        }

        return { data: res.data };
      },
      keepUnusedDataFor: 900,
    }),

    signUp: builder.mutation({
      async queryFn(freshData) {
        const res = await signUpAccount(freshData);

        if (!res.success) return { error: res.error };
        return { data: res.data };
      },
      onQueryStarted: updateAuthCache,
    }),

    signIn: builder.mutation({
      async queryFn(freshData) {
        const res = await signInAccount(freshData);

        if (!res.success) return { error: res.error };
        return { data: res.data };
      },
      onQueryStarted: updateAuthCache,
    }),

    getUser: builder.query<User, void>({
      query: () => "/user",
      providesTags: ['User']
    })
  }),
});


export const { useRefreshAccessTkQuery, useSignUpMutation,
  useSignInMutation, useGetUserQuery
} = apiSlice;