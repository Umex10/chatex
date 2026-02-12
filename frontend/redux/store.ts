"use client"

import { configureStore } from "@reduxjs/toolkit";

import accessJwtSlice from "./slices/accessJwtSlice";

/**
 * Configures and exports the Redux store for the application.
 * Contains the access JWT state management.
 */
export const store = configureStore({
    reducer: {
        accessJwtState: accessJwtSlice
    }
})

/**
 * Type representing the entire Redux state tree.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type for the Redux dispatch function.
 */
export type AppDispatch = typeof store.dispatch;