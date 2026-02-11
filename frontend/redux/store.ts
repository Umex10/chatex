"use client"

import { configureStore } from "@reduxjs/toolkit";

import accessJwtSlice from "./slices/accessJwtSlice";

export const store = configureStore({
    reducer: {
        accessJwtState: accessJwtSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;