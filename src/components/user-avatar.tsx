"use client"

import { User } from "@clerk/nextjs/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type UserAvatarProps = {
  user: User | null
  className?: string
  fallback?: string
}

export function UserAvatar({ user, className, fallback }: UserAvatarProps) {
  const imageUrl = user?.imageUrl
  const fallbackText =
    fallback ??
    (user?.firstName?.[0] ?? user?.lastName?.[0] ?? user?.username?.[0] ?? "U")

  return (
    <Avatar className={cn("h-10 w-10", className)}>
      <AvatarImage src={imageUrl} alt={user?.fullName ?? "User"} />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  )
}
