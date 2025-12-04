import { auth, currentUser } from "@clerk/nextjs/server"

export async function requireUser() {
  const { userId } = auth()
  if (!userId) return null
  const user = await currentUser()
  return user
}
