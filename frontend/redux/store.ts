"use client"

import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./api/apis/apiSlice";
import { chatSlice } from "./api/slices/chatSlice";

/**
 * Configures and exports the Redux store for the application.
 * Contains the access JWT state management.
 */
export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        chatState: chatSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware)
});

/**
 * Type representing the entire Redux state tree.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type for the Redux dispatch function.
 */
export type AppDispatch = typeof store.dispatch;