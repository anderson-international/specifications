'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import ProductSearch from './ProductSearch'
import ProductGrid from './ProductGrid'
import SelectedProductSummary from './SelectedProductSummary'
import ValidationSummary, { ValidationError } from '../controls/ValidationSummary'
import { Product, Brand, ProductSelectionFormData } from './types'
import styles from './ProductSelection.module.css'

interface ProductSelectionProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
}

/**
 * First step of the specification wizard for selecting a product
 */
const ProductSelection = ({
  stepNumber,
  totalSteps,
  disabled = false
}: ProductSelectionProps): JSX.Element => {
  // Form context
  const { watch, setValue, formState: { errors } } = useFormContext<ProductSelectionFormData>()
  
  // Watch for form value changes
  const productId = watch('product_id')
  const shopifyHandle = watch('shopify_handle')
  const brandId = watch('brand_id')
  
  // Local state
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Selected product from the current products list
  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === productId) || null
  }, [products, productId])

  // Filtered products based on search term and brand filter
  const filteredProducts = useMemo(() => {
    let filtered = [...products]
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchLower) || 
        p.brand_name.toLowerCase().includes(searchLower)
      )
    }
    
    if (selectedBrandId) {
      filtered = filtered.filter(p => p.brand_id === selectedBrandId)
    }
    
    return filtered
  }, [products, searchTerm, selectedBrandId])

  // Validation errors
  const validationErrors = useMemo((): ValidationError[] => {
    const errorList: ValidationError[] = []
    if (errors.product_id) {
      errorList.push({
        fieldName: 'product_id',
        message: errors.product_id.message || 'Please select a product'
      })
    }
    return errorList
  }, [errors])

  // Fetch products and brands from API
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true)
      setError(null)
      try {
        // Fetch products from API
        const productsResponse = await fetch('/api/products')
        if (!productsResponse.ok) throw new Error('Failed to load products')
        const productsData = await productsResponse.json()
        setProducts(productsData.products || [])
        
        // Fetch brands from API
        const brandsResponse = await fetch('/api/enum/enum_brands')
        if (!brandsResponse.ok) throw new Error('Failed to load brands')
        const brandsData = await brandsResponse.json()
        setBrands(brandsData || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Handle product selection
  const handleProductSelect = useCallback((product: Product): void => {
    setValue('product_id', Number(product.id), { shouldValidate: true })
    setValue('shopify_handle', product.handle, { shouldValidate: true })
    setValue('brand_id', product.brand_id, { shouldValidate: true })
  }, [setValue])
  
  // Handle search change
  const handleSearchChange = useCallback((value: string): void => {
    setSearchTerm(value)
  }, [])
  
  // Handle brand filter change
  const handleBrandChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value
    setSelectedBrandId(value ? Number(value) : null)
  }, [])
  
  // Check if the step is valid
  const isValid = useMemo((): boolean => {
    return !errors.product_id
  }, [errors.product_id])

  return (
    <WizardStepCard
      title="Product Selection"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isValid={isValid}
    >
      <ValidationSummary errors={validationErrors} />
      
      <div className={styles.filterBar}>
        <ProductSearch
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          disabled={disabled || loading}
        />
        
        <div className={styles.brandFilter}>
          <select
            value={selectedBrandId?.toString() || ''}
            onChange={handleBrandChange}
            className={styles.brandSelect}
            disabled={disabled || loading}
            aria-label="Filter by brand"
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <SelectedProductSummary
        product={selectedProduct}
        shopifyHandle={shopifyHandle}
        brandId={brandId}
      />
      
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading products...</p>
        </div>
      ) : (
        <ProductGrid
          products={filteredProducts}
          selectedProduct={selectedProduct}
          onProductSelect={handleProductSelect}
          disabled={disabled}
        />
      )}
    </WizardStepCard>
  )
}

// Export with React.memo for performance optimization
export default React.memo(ProductSelection)
