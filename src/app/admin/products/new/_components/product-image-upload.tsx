"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import type { ChangeEvent, DragEvent } from "react"
import { motion } from "framer-motion"
import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useUploadThing } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"

type ProductImageUploadProps = {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
}

const MAX_SIZE_MB = 4
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"]

export function ProductImageUpload({
  value,
  onChange,
  maxFiles = 4,
}: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const { startUpload, isUploading } = useUploadThing("productImage")

  const remaining = useMemo(() => Math.max(maxFiles - value.length, 0), [maxFiles, value.length])

  const validateFiles = (files: File[]) => {
    const errors: string[] = []
    const allowed = files.slice(0, remaining)
    const accepted = allowed.filter((file) => {
      const typeOk = ACCEPTED.includes(file.type)
      const sizeOk = file.size <= MAX_SIZE_MB * 1024 * 1024
      if (!typeOk) errors.push(`${file.name}: unsupported type`)
      if (!sizeOk) errors.push(`${file.name}: exceeds ${MAX_SIZE_MB}MB`)
      return typeOk && sizeOk
    })
    if (files.length > allowed.length) {
      errors.push(`Only ${remaining} more image${remaining === 1 ? "" : "s"} allowed.`)
    }
    return { accepted, errors }
  }

  const handleUpload = useCallback(
    async (files: File[]) => {
      if (!files.length || isUploading) return
      if (remaining <= 0) {
        toast({
          title: "Upload limit reached",
          description: `Maximum of ${maxFiles} images.`,
          variant: "destructive",
        })
        return
      }

      const { accepted, errors } = validateFiles(files)
      if (errors.length) {
        toast({
          title: "Upload issues",
          description: errors.join(" "),
          variant: "destructive",
        })
      }
      if (!accepted.length) return

      try {
        const res = await startUpload(accepted)
        const urls = res?.map((f) => f.url).filter((u): u is string => Boolean(u)) ?? []
        if (urls.length) {
          const merged = Array.from(new Set([...value, ...urls]))
          onChange(merged)
          toast({
            title: "Images uploaded",
            description: `${urls.length} image${urls.length === 1 ? "" : "s"} added.`,
          })
        }
      } catch (error) {
        console.error("upload error", error)
        toast({
          title: "Upload failed",
          description: "Unable to upload images right now.",
          variant: "destructive",
        })
      }
    },
    [isUploading, maxFiles, onChange, remaining, startUpload, value]
  )

  const onDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const files = Array.from(event.dataTransfer.files || [])
    await handleUpload(files)
  }

  const onSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    await handleUpload(files)
    if (inputRef.current) inputRef.current.value = ""
  }

  const removeImage = (url: string) => {
    onChange(value.filter((img) => img !== url))
  }

  return (
    <Card className="border-white/10 bg-white/5 text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <CardHeader className="gap-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <ImageIcon className="size-5 text-white/70" />
          Product images
        </CardTitle>
        <CardDescription className="text-white/60">
          Drag & drop or click to upload. Max {maxFiles} images, {MAX_SIZE_MB}MB each.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          onDragOver={(event) => {
            event.preventDefault()
            event.dataTransfer.dropEffect = "copy"
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          animate={{ scale: isDragging ? 1.01 : 1 }}
          className={cn(
            "relative overflow-hidden rounded-2xl border-2 border-dashed border-white/15 bg-white/5 transition-colors",
            isDragging && "border-white/40 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            multiple
            className="hidden"
            onChange={onSelect}
            disabled={isUploading || remaining <= 0}
          />

          <div className="flex flex-col items-center gap-3 px-6 py-8 text-center text-white/80">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              {isUploading ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {remaining <= 0 ? "Upload limit reached" : "Drop files here or choose images"}
              </p>
              <p className="text-xs text-white/60">
                Remaining slots: {remaining}. Allowed: jpeg, png, webp, avif.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading || remaining <= 0}
              className="border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
            >
              {isUploading ? "Uploading..." : "Select files"}
            </Button>
          </div>
        </motion.div>

        {value.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {value.map((url) => (
              <div
                key={url}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Uploaded"
                  className="h-32 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-2 top-2 inline-flex items-center justify-center rounded-full border border-white/20 bg-black/70 p-1.5 text-white opacity-0 shadow-md backdrop-blur transition hover:text-white group-hover:opacity-100"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
