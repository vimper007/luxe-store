import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@clerk/nextjs/server"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => {
      const user = await auth()
      if (!user.userId) throw new Error("Unauthorized")
      return { userId: user.userId }
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete", file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
