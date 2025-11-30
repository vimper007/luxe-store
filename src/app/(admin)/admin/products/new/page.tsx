'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { createProduct } from '@/app/actions/products'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('description', values.description)
      formData.append('price', values.price.toString())
      formData.append('stock', values.stock.toString())
      formData.append('category', values.category)

      const result = await createProduct(formData)
      if (result?.error) {
        alert(result.error)
        return
      }

      alert('Product created')
      reset()
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Product name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the product"
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register('price', { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  {...register('stock', { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="text-sm text-red-500">{errors.stock.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="Category"
                {...register('category')}
              />
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
