import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type CartItem = {
  productId: number
  slug: string
  name: string
  price: number
  image?: string
  quantity: number
}

export type CartState = {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const hydrate = (): CartState => {
  if (typeof window === "undefined") return initialState
  try {
    const stored = window.localStorage.getItem("luxe-cart")
    if (!stored) return initialState
    return JSON.parse(stored) as CartState
  } catch {
    return initialState
  }
}

const persist = (state: CartState) => {
  if (typeof window === "undefined") return
  window.localStorage.setItem("luxe-cart", JSON.stringify(state))
}

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateFromStorage(state) {
      const data = hydrate()
      state.items = data.items
    },
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((item) => item.productId === action.payload.productId)
      if (existing) {
        existing.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      persist(state)
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.productId !== action.payload)
      persist(state)
    },
    updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const item = state.items.find((i) => i.productId === action.payload.productId)
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
      }
      persist(state)
    },
    clearCart(state) {
      state.items = []
      persist(state)
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart, hydrateFromStorage } = slice.actions
export const cartReducer = slice.reducer
