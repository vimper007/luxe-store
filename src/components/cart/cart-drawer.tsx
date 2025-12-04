"use client"

import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "@/components/ui/use-toast"
import { RootState } from "@/store"
import { clearCart, removeItem, updateQuantity } from "@/store/cartSlice"
import { closeCart } from "@/store/uiSlice"

export function CartDrawer() {
  const dispatch = useDispatch()
  const isOpen = useSelector((state: RootState) => state.ui.isCartOpen)
  const items = useSelector((state: RootState) => state.cart.items)

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  const checkout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed")
      window.location.href = data.url as string
    } catch (error) {
      console.error(error)
      toast({
        title: "Checkout failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (!open ? dispatch(closeCart()) : null)}>
      <SheetTrigger className="hidden" />
      <SheetContent className="glass-panel w-[420px] border-white/10 bg-white/5 text-white">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-white/70">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex items-start justify-between rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-white/70">${item.price.toFixed(2)}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
                    <button
                      type="button"
                      className="rounded-full border border-white/20 px-2"
                      onClick={() =>
                        dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      className="rounded-full border border-white/20 px-2"
                      onClick={() =>
                        dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(removeItem(item.productId))}
                  className="rounded-full border border-white/20 p-1 text-white/70 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm text-white/80">
            <span>Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <Button className="flex-1" onClick={checkout} disabled={items.length === 0}>
              Checkout
            </Button>
            <Button variant="ghost" onClick={() => dispatch(clearCart())} disabled={items.length === 0}>
              Clear
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
