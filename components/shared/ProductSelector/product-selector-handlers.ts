// ProductSelector event handlers

import type { Product } from './product-selector-interfaces';

// Create product selection handler
export const createProductSelectHandler = (
  mode: 'single' | 'multi',
  setSelectedProductIds: React.Dispatch<React.SetStateAction<string[]>>,
  selectedProductIdsRef: React.MutableRefObject<string[]>,
  onSelectionChange: (productIds: string[]) => void
) => {
  return (product: Product): void => {
    if (mode === 'single') {
      const newIds = [product.id];
      setSelectedProductIds(newIds);
      selectedProductIdsRef.current = newIds;
      onSelectionChange(newIds);
    } else {
      setSelectedProductIds(prev => {
        const isSelected = prev.includes(product.id);
        const newIds = isSelected
          ? prev.filter(id => id !== product.id)
          : [...prev, product.id];
        
        selectedProductIdsRef.current = newIds;
        return newIds;
      });
    }
  };
};

// Create remove product handler
export const createRemoveProductHandler = (
  setSelectedProductIds: React.Dispatch<React.SetStateAction<string[]>>,
  selectedProductIdsRef: React.MutableRefObject<string[]>
) => {
  return (productId: string): void => {
    setSelectedProductIds(prev => {
      const newIds = prev.filter(id => id !== productId);
      selectedProductIdsRef.current = newIds;
      return newIds;
    });
  };
};

// Create clear all handler
export const createClearAllHandler = (
  setSelectedProductIds: React.Dispatch<React.SetStateAction<string[]>>,
  selectedProductIdsRef: React.MutableRefObject<string[]>
) => {
  return (): void => {
    const newIds: string[] = [];
    setSelectedProductIds(newIds);
    selectedProductIdsRef.current = newIds;
  };
};

// Create confirm selection handler
export const createConfirmSelectionHandler = (
  selectedProductIdsRef: React.MutableRefObject<string[]>,
  onSelectionChange: (productIds: string[]) => void
) => {
  return (): void => {
    onSelectionChange(selectedProductIdsRef.current);
  };
};

// Create clear filters handler
export const createClearFiltersHandler = (
  setSearchTerm: (term: string) => void,
  setSelectedBrand: (brand: string) => void
) => {
  return (): void => {
    setSearchTerm('');
    setSelectedBrand('');
  };
};
