import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * RTK Query base API slice for the Chatex backend.
 * Domain-specific endpoints are injected via separate files
 * (authApi, userApi, followApi, shoutApi) using `injectEndpoints`.
 * The `prepareHeaders` callback automatically injects the stored access JWT
 * into every request that requires authentication.
 */
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL_LOCAL}/api/v1`,
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
  endpoints: () => ({}),
});