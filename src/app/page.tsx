'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Award, Clock, Shield, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/layout/glass-card"

const bento = [
  { title: "Curated Collections", icon: Sparkles, body: "Premium picks crafted for you." },
  { title: "Express Shipping", icon: Clock, body: "Fast, reliable delivery worldwide." },
  { title: "Trusted Quality", icon: Shield, body: "Only vetted, luxury-grade goods." },
  { title: "Member Rewards", icon: Award, body: "Earn perks on every purchase." },
]

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-5xl font-semibold leading-tight"
          >
            Luxe Store
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Discover premium products with curated design, effortless checkout, and luxury support.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <Button asChild size="lg">
              <Link href="/shop">
                Shop Collection
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="border-white/20 text-white">
              <Link href="/#story">Our Story</Link>
            </Button>
          </motion.div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {bento.map((card, idx) => (
            <GlassCard key={card.title} className="space-y-2 p-5">
              <card.icon className="size-5 text-white/70" />
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Trending</h2>
          <Link href="/shop" className="text-sm text-muted-foreground">
            View all
          </Link>
        </div>
        <GlassCard className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-muted-foreground">
              No trending products yet. Add items in the admin to feature them here.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/admin/products/new">Add product</Link>
          </Button>
        </GlassCard>
      </section>

      <section id="story" className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <GlassCard key={i} className="space-y-2 p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div>
                <p className="font-semibold">Customer {i}</p>
                <p className="text-xs text-muted-foreground">Verified buyer</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              “Luxe Store delivers phenomenal quality and a flawless experience.”
            </p>
          </GlassCard>
        ))}
      </section>

      <section className="glass-panel p-6 space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold">Join the Luxe List</h3>
            <p className="text-sm text-muted-foreground">
              Get exclusive drops, offers, and design stories.
            </p>
          </div>
          <div className="flex w-full max-w-md gap-2">
            <input
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Your email"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
