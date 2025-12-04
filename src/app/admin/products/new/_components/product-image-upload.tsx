"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import type { ChangeEvent, DragEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useUploadThing } from "@/lib/uploadthing"

type ProductImageUploadProps = {
  value: string[]
  onChange: (urls: string[]) => void
}

const MAX_FILES = 4
const MAX_SIZE_MB = 4
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]

export function ProductImageUpload({ value, onChange }: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)

  const { startUpload, isUploading } = useUploadThing("productImage", {
    uploadProgressGranularity: "fine",
    onUploadProgress: (percent) => setProgress(Math.round(percent)),
    onUploadError: (error) => {
      setProgress(null)
      toast({
        title: "Upload failed",
        description: error?.message ?? "Unable to upload images right now.",
        variant: "destructive",
      })
    },
  })

  const availableSlots = useMemo(() => Math.max(MAX_FILES - value.length, 0), [value])

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (!files.length || isUploading) return

      const remaining = Math.max(MAX_FILES - value.length, 0)
      if (remaining <= 0) {
        toast({
          title: "Upload limit reached",
          description: `You can upload up to ${MAX_FILES} images for each product.`,
          variant: "destructive",
        })
        return
      }

      const limited = files.slice(0, remaining)
      const errors: string[] = []

      const validFiles = limited.filter((file) => {
        const typeOk = ACCEPTED_TYPES.includes(file.type)
        const sizeOk = file.size <= MAX_SIZE_MB * 1024 * 1024

        if (!typeOk) errors.push(`${file.name}: unsupported type`)
        if (!sizeOk) errors.push(`${file.name}: exceeds ${MAX_SIZE_MB}MB`)

        return typeOk && sizeOk
      })

      if (files.length > limited.length) {
        errors.push(`Only ${remaining} more image${remaining === 1 ? "" : "s"} allowed.`)
      }

      if (errors.length) {
        toast({
          title: "Upload issues",
          description: errors.join(" "),
          variant: "destructive",
        })
      }

      if (!validFiles.length) return

      setProgress(0)

      try {
        const result = await startUpload(validFiles)
        const uploadedUrls = result
          ?.map((file) => file.url)
          .filter((url): url is string => Boolean(url)) ?? []

        if (uploadedUrls.length) {
          const merged = Array.from(new Set([...value, ...uploadedUrls]))
          onChange(merged)
          toast({
            title: "Images uploaded",
            description: `${uploadedUrls.length} image${uploadedUrls.length === 1 ? "" : "s"} added.`,
          })
        }
      } catch (error) {
        const description =
          error instanceof Error ? error.message : "Something went wrong while uploading."
        toast({
          title: "Upload failed",
          description,
          variant: "destructive",
        })
      } finally {
        setProgress(null)
        if (inputRef.current) {
          inputRef.current.value = ""
        }
      }
    },
    [isUploading, value, onChange, startUpload]
  )

  const onDrop = useCallback(
    async (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)
      const files = Array.from(event.dataTransfer.files || [])
      await handleFiles(files)
    },
    [handleFiles]
  )

  const onSelectFiles = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])
      await handleFiles(files)
    },
    [handleFiles]
  )

  const removeImage = useCallback(
    (url: string) => {
      const updated = value.filter((item) => item !== url)
      onChange(updated)
    },
    [onChange, value]
  )

  const disabled = isUploading || availableSlots === 0

  return (
    <Card className="border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5 text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <CardHeader className="gap-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
          <ImageIcon className="size-5 text-white/70" />
          Product images
        </CardTitle>
        <CardDescription className="text-white/60">
          Upload up to {MAX_FILES} visuals. Drag and drop or browse your library.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          onDragOver={(event) => {
            event.preventDefault()
            event.dataTransfer.dropEffect = "copy"
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors duration-200 hover:border-white/30"
          data-disabled={disabled}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            multiple
            className="hidden"
            onChange={onSelectFiles}
            disabled={disabled}
          />

          <div
            className="flex flex-col items-center gap-4 px-6 py-8 text-center"
            aria-disabled={disabled}
          >
            <div
              className={`flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 shadow-inner transition ${
                isDragging ? "border-white/30 bg-white/10" : ""
              }`}
            >
              {isUploading ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-white">
                {disabled ? "Upload limit reached" : "Drop files here or choose images"}
              </p>
              <p className="text-xs text-white/70">
                PNG, JPG up to 4MB. Remaining slots: {availableSlots}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
                className="border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
              >
                {isUploading ? "Uploading" : "Select files"}
              </Button>
              <span className="text-xs text-white/60">Drag and drop anywhere inside the card</span>
            </div>
          </div>

          <div
            className={`absolute inset-0 transition ${
              isDragging ? "border-white/30 bg-white/10 ring-2 ring-white/20" : "pointer-events-none"
            }`}
            aria-hidden
          />

          {progress !== null && (
            <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden rounded-b-2xl bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-white/70 via-white to-white/70 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        <AnimatePresence>
          {value.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="grid grid-cols-2 gap-4 md:grid-cols-3"
            >
              {value.map((url, index) => (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, type: "spring", stiffness: 220, damping: 20 }}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={url}
                      alt="Product"
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 40vw, 50vw"
                      className="rounded-xl object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute right-2 top-2 inline-flex items-center justify-center rounded-full border border-white/20 bg-black/60 p-1.5 text-white/80 opacity-0 shadow-md backdrop-blur transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="size-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
