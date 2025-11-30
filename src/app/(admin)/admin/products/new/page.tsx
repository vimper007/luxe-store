'use client'

import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { createProduct } from '@/app/actions/products'
import type { OurFileRouter } from '@/app/api/uploadthing/core'
import { UploadDropzone } from '@/lib/uploadthing'
import { ProductInput, productSchema } from '@/lib/validations/product'

export default function NewProductPage() {
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      images: [],
    },
  })

  const images = watch('images') || []

  const onSubmit = (values: ProductInput) => {
    startTransition(async () => {
      const result = await createProduct(values)
      if (!result.success) {
        alert(result.error || 'Failed to create product')
        return
      }
      alert('Product created')
      reset()
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <div className="max-w-4xl mx-auto py-10 px-6">
        <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-playfair font-bold text-white mb-8">
            Create New Product
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Luxe Wireless Headphones"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Describe the product and its standout features."
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-300" htmlFor="price">
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="299.00"
                  {...register('price', { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-red-400">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-300" htmlFor="stock">
                  Stock
                </label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="50"
                  {...register('stock', { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="text-sm text-red-400">{errors.stock.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="category">
                Category
              </label>
              <input
                id="category"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Audio"
                {...register('category')}
              />
              {errors.category && (
                <p className="text-sm text-red-400">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm text-zinc-300">Images</label>
              <UploadDropzone<OurFileRouter>
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  const uploaded = res?.map((f) => f.url).filter(Boolean) || []
                  setValue('images', [...images, ...uploaded], { shouldValidate: true })
                }}
                onUploadError={(error) => alert(error.message)}
                className="ut-upload-area bg-zinc-950/50 border border-dashed border-zinc-800 rounded-xl p-6 text-zinc-300"
              />
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {images.map((url) => (
                    <div
                      key={url}
                      className="h-16 w-16 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900"
                    >
                      <img
                        src={url}
                        alt="Uploaded preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-white py-4 text-lg font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-60"
            >
              {isPending ? 'Creating...' : 'Create Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
