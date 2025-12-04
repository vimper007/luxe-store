"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { ProductImageUpload } from "@/app/admin/products/new/_components/product-image-upload"
import { toast } from "@/components/ui/use-toast"
import { createProduct } from "@/app/actions/products"
import { ProductInput, productSchema } from "@/lib/validations/product"

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
      name: "",
      category: "",
      price: 0,
      stock: 0,
      description: "",
      images: [],
    },
  })

  const images = watch("images") || []

  const onSubmit = (values: ProductInput) => {
    startTransition(async () => {
      const result = await createProduct(values)
      if (!result.success) {
        toast({
          title: "Product creation failed",
          description: result.error || "Unable to create product right now.",
          variant: "destructive",
        })
        return
      }
      toast({ title: "Product created", description: "Your product is now live." })
      reset()
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto py-10 px-4 lg:px-8">
        <h1 className="text-2xl font-semibold mb-6 font-playfair">Create New Product</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Media Column */}
          <div className="lg:col-span-4">
            <ProductImageUpload
              value={images}
              onChange={(urls) => setValue("images", urls, { shouldValidate: true })}
            />
          </div>

          {/* Form Column */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground" htmlFor="name">
                    Product Name
                  </label>
                  <input
                    id="name"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Luxe Wireless Headphones"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground" htmlFor="category">
                      Category
                    </label>
                    <input
                      id="category"
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Audio"
                      {...register("category")}
                    />
                    {errors.category && (
                      <p className="text-sm text-red-500">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground" htmlFor="price">
                      Price
                    </label>
                    <input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="299.00"
                      {...register("price", { valueAsNumber: true })}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-500">{errors.price.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground" htmlFor="stock">
                      Stock
                    </label>
                    <input
                      id="stock"
                      type="number"
                      min="0"
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="50"
                      {...register("stock", { valueAsNumber: true })}
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-500">{errors.stock.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Describe the product and its standout features."
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-xl bg-foreground px-4 py-3 text-background font-semibold transition hover:opacity-90 disabled:opacity-60"
                >
                  {isPending ? "Creating..." : "Create Product"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
