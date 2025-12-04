import { createSlice } from "@reduxjs/toolkit"

type UiState = {
  isCartOpen: boolean
}

const initialState: UiState = {
  isCartOpen: false,
}

const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen
    },
    openCart(state) {
      state.isCartOpen = true
    },
    closeCart(state) {
      state.isCartOpen = false
    },
  },
})

export const { toggleCart, openCart, closeCart } = slice.actions
export const uiReducer = slice.reducer
