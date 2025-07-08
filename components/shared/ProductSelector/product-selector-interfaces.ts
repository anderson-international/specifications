/**
 * Types for ProductSelector Component Interfaces
 */
import type { Product } from '@/lib/types/product'

// Re-export Product type for backward compatibility
export type { Product }

export interface ProductSelectorProps {
  mode: 'single' | 'multi'
  onSelectionChange: (productIds: string[]) => void
  initialSelection?: string[]
  title?: string
  searchPlaceholder?: string
  disabled?: boolean
}

export interface ProductRowProps {
  product: Product
  isSelected: boolean
  onSelect: (product: Product) => void
  disabled?: boolean
  mode: 'single' | 'multi'
}

export interface SelectedProductsModalProps {
  isOpen: boolean
  onClose: () => void
  selectedProducts: Product[]
  onRemoveProduct: (productId: string) => void
  onClearAll: () => void
  onConfirm: () => void
}
