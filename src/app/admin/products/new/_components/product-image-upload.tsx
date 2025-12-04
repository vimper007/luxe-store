'use client'

import { useRef, useState, DragEvent, ChangeEvent } from "react"

import { useUploadThing } from "@/lib/uploadthing"

type ProductImageUploadProps = {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
}

export function ProductImageUpload({
  value,
  onChange,
  maxFiles = 4,
}: ProductImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const { startUpload, isUploading } = useUploadThing("productImage")

  const handleFiles = async (files: File[]) => {
    if (!files.length || isUploading) return
    const remaining = maxFiles - value.length
    if (remaining <= 0) return
    const selected = files.slice(0, remaining)
    const res = await startUpload(selected)
    const uploaded = res
      ?.map((file) => file.url)
      .filter((url): url is string => Boolean(url)) ?? []
    if (uploaded.length) {
      onChange([...value, ...uploaded])
    }
  }

  const onDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const files = Array.from(event.dataTransfer.files || [])
    await handleFiles(files)
  }

  const onSelectFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    await handleFiles(files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = (url: string) => {
    onChange(value.filter((img) => img !== url))
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl shadow-lg transition ${
          isDragging ? "ring-2 ring-white/20" : ""
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onSelectFiles}
        />
        <div className="flex flex-col items-center gap-2 text-sm text-white/70">
          <p>Drag & drop images here or</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || value.length >= maxFiles}
            className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:bg-white disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : "Select files"}
          </button>
          <p className="text-xs text-white/60">
            Up to {maxFiles} images • 4MB each • Remaining: {Math.max(maxFiles - value.length, 0)}
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {value.map((url) => (
            <div
              key={url}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-md"
            >
              <img src={url} alt="Uploaded" className="h-32 w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white opacity-0 shadow-sm transition group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
