import { configureStore } from '@reduxjs/toolkit';

// We need a dummy reducer so Redux Toolkit doesn't throw "Store does not have a valid reducer"
// This will be replaced by real slices later.
const initialCartState = { items: [] };
const cartReducer = (state = initialCartState, action: { type: string }) => state;

export const store = configureStore({
  reducer: {
    cart: cartReducer, // Placeholder reducer to satisfy initialization
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
