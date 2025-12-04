"use client"

import * as SheetPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close

const SheetContent = ({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content>) => (
  <SheetPrimitive.Portal>
    <SheetPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
    <SheetPrimitive.Content
      className={cn(
        "fixed right-0 top-0 z-50 h-full w-80 overflow-y-auto bg-background p-6 shadow-xl",
        className
      )}
      {...props}
    >
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
        <X className="size-4" />
      </SheetPrimitive.Close>
      {props.children}
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
)

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-4 space-y-2", className)} {...props} />
)

const SheetTitle = SheetPrimitive.Title

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose }
