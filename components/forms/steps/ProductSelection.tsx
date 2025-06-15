'use client'

import { useState, useMemo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ProductSelection as ProductSelectionType, productSelectionSchema } from '@/lib/schemas/specification'
import { ProductSearchBar } from './ProductSearchBar'
import { ProductGrid } from './ProductGrid'
import styles from './ProductSelection.module.css'

interface Product {
  id: string
  handle: string
  title: string
  brand: string
  image_url: string | null
  is_reviewed: boolean
}

interface ProductSelectionProps {
  initialData?: Partial<ProductSelectionType>
  onNext: (data: ProductSelectionType) => void
  preselectedProductId?: string
}

export function ProductSelection({
  initialData,
  onNext,
  preselectedProductId
}: ProductSelectionProps): JSX.Element {
  const [products] = useState<Product[]>([
    {
      id: '1',
      handle: 'sp-extra-white',
      title: 'SP Extra White',
      brand: 'Pöschl',
      image_url: null,
      is_reviewed: true
    },
    {
      id: '2',
      handle: 'ozona-irish-high-dry-toast',
      title: 'Ozona Irish High Dry Toast',
      brand: 'WE Garrett',
      image_url: null,
      is_reviewed: false
    },
    {
      id: '3',
      handle: 'toque-quit',
      title: 'Toque Quit',
      brand: 'Toque',
      image_url: null,
      is_reviewed: true
    }
  ])

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    preselectedProductId 
      ? products.find(p => p.id === preselectedProductId) || null 
      : null
  )

  const {
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm<ProductSelectionType>({
    resolver: zodResolver(productSelectionSchema),
    defaultValues: initialData
  })

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products
    
    return products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [products, searchTerm])

  const handleProductSelect = useCallback((product: Product): void => {
    setSelectedProduct(product)
    setValue('productId', product.id)
    setValue('productHandle', product.handle)
    setValue('productTitle', product.title)
  }, [setValue])

  const onSubmit = useCallback((data: ProductSelectionType): void => {
    onNext(data)
  }, [onNext])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <ProductSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <ProductGrid
        products={filteredProducts}
        selectedProduct={selectedProduct}
        onProductSelect={handleProductSelect}
      />

      {/* Error Display */}
      {errors.productId && (
        <div className={styles.error}>
          {errors.productId.message}
        </div>
      )}

      {/* Selected Product Summary */}
      {selectedProduct && (
        <div className={styles.summary}>
          <h4 className={styles.summaryTitle}>Selected Product:</h4>
          <p className={styles.summaryText}>
            {selectedProduct.title} by {selectedProduct.brand}
          </p>
        </div>
      )}

      {/* Continue Button */}
      <button
        type="submit"
        disabled={!isValid || !selectedProduct}
        className={styles.continueButton}
      >
        Continue to Characteristics
      </button>
    </form>
  )
}
