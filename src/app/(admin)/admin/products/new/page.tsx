'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { createProduct } from '@/app/actions/products'
import { ProductInput, productSchema } from '@/lib/validations/product'

export default function NewProductPage() {
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
    },
  })

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
    <div className="min-h-screen bg-black/95 text-white flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 via-transparent to-purple-500/10 blur-3xl" />
      <div className="w-full max-w-4xl">
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 md:p-10 rounded-2xl backdrop-blur shadow-2xl">
          <div className="mb-8">
            <h1 className="font-playfair text-3xl md:text-4xl font-semibold tracking-tight">
              Create New Product
            </h1>
            <p className="text-zinc-400 mt-2">
              Add premium inventory with clear pricing and stock controls.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
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
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
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
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
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
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
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
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Audio"
                {...register('category')}
              />
              {errors.category && (
                <p className="text-sm text-red-400">{errors.category.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-white py-6 text-lg font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-60"
            >
              {isPending ? 'Creating...' : 'Create Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
