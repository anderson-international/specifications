'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from './product-selector-interfaces';
import type { UseProductSelectorProps, UseProductSelectorReturn } from './product-selector-types';
import { 
  createProductSelectHandler, 
  createRemoveProductHandler, 
  createClearAllHandler, 
  createConfirmSelectionHandler, 
  createClearFiltersHandler 
} from './product-selector-handlers';
import { useTransformedProducts, useFilteredProducts, useSelectedProducts, useBrandOptions } from './product-selector-memos';

export const useProductSelector = ({
  mode,
  initialSelection = [],
  onSelectionChange
}: UseProductSelectorProps): UseProductSelectorReturn => {
  const {
    isLoading,
    error,
    filteredProducts: rawProducts,
    availableBrands,
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand
  } = useProducts();

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialSelection);
  const selectedProductIdsRef = useRef<string[]>(initialSelection);

  // Use extracted memo hooks
  const products = useTransformedProducts(rawProducts);
  const filteredProducts = useFilteredProducts(products, searchTerm, selectedBrand);
  const selectedProducts = useSelectedProducts(products, selectedProductIdsRef);
  const brandOptions = useBrandOptions(availableBrands);

  // Create handlers using utility functions
  const handleProductSelect = useCallback(
    createProductSelectHandler(mode, setSelectedProductIds, selectedProductIdsRef, onSelectionChange),
    mode === 'single' ? [mode, onSelectionChange] : [mode]
  );

  const handleRemoveProduct = useCallback(
    createRemoveProductHandler(setSelectedProductIds, selectedProductIdsRef),
    []
  );

  const handleClearAll = useCallback(
    createClearAllHandler(setSelectedProductIds, selectedProductIdsRef),
    []
  );

  const handleConfirmSelection = useCallback(
    createConfirmSelectionHandler(selectedProductIdsRef, onSelectionChange),
    [onSelectionChange]
  );

  const handleClearFilters = useCallback(
    createClearFiltersHandler(setSearchTerm, setSelectedBrand),
    [setSearchTerm, setSelectedBrand]
  );

  // Update initial selection when prop changes
  useEffect(() => {
    setSelectedProductIds(initialSelection);
    selectedProductIdsRef.current = initialSelection;
  }, [initialSelection]);

  return {
    products,
    filteredProducts,
    selectedProducts,
    selectedProductIds,
    searchTerm,
    selectedBrand,
    isLoading,
    error,
    setSearchTerm,
    setSelectedBrand,
    handleProductSelect,
    handleClearFilters,
    handleRemoveProduct,
    handleClearAll,
    handleConfirmSelection,
    brandOptions
  };
};
