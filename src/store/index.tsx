"use client"

import type { ReactNode } from "react"
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"

import { productsApi } from "./api/productsApi"
import { cartReducer } from "./cartSlice"
import { uiReducer } from "./uiSlice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    ui: uiReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(productsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
