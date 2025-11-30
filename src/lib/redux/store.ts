import { configureStore } from '@reduxjs/toolkit'

// Temp reducer to init store
const cartReducer = (state = { items: [] }, action: any) => state

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
