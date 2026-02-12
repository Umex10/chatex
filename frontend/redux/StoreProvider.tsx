"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";

interface StoreProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that wraps the application with Redux store.
 * Makes the Redux store available to all child components.
 */
export default function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}