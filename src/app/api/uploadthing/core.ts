import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@clerk/nextjs/server"

const f = createUploadthing()

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async () => {
      const user = await auth()
      if (!user?.userId) {
        throw new Error("Unauthorized")
      }
      return { userId: user.userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete", { metadata, url: file.url })
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
