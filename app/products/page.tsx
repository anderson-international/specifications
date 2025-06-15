'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'

import ProductCard from '../../components/products/ProductCard'
import ProductFilters from '../../components/products/ProductFilters'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import styles from './products.module.css'

interface Product {
  id: string
  shopify_handle: string
  title: string
  brand: string
  price: number
  imageUrl: string
  type: string
  is_reviewed: boolean
}

export default function ProductsPage(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const { stats } = useDashboardStats()

  const fetchProducts = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`)
      }
      const data = await response.json()
      setProducts(data.products)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Use useMemo for derived state instead of useEffect to prevent loops
  const filteredProducts = useMemo((): Product[] => {
    let filtered = products

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply brand filter
    if (selectedBrand) {
      filtered = filtered.filter(product => product.brand === selectedBrand)
    }

    return filtered
  }, [products, searchTerm, selectedBrand])

  const availableBrands = useMemo(() => [...new Set(products.map(p => p.brand))], [products])

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading Products</h2>
          <p>{error}</p>
          <button 
            onClick={() => fetchProducts()} 
            className={styles.retryButton}
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading products...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.stats}>
          {stats?.reviewed_products || 0} of {stats?.total_products || 0} products reviewed
        </p>
      </header>

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
        availableBrands={availableBrands}
      />

      <div className={styles.grid}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && !isLoading && (
        <div className={styles.empty}>
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
