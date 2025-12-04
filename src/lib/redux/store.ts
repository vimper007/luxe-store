import { configureStore } from "@reduxjs/toolkit"

type CartState = { items: unknown[] }

const initialState: CartState = { items: [] }

const cartReducer = (state: CartState = initialState) => state

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
