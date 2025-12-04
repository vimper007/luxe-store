import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

type CartItem = {
  name: string
  slug: string
  price: number
  quantity: number
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items: CartItem[] }
    const lineItems =
      body.items?.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })) ?? []

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("checkout error", error)
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 400 })
  }
}
