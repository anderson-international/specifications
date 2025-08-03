import type { Product } from '@/lib/types/product'

export type { Product }

export interface ProductSelectorProps {
  mode: 'single' | 'multi'
  onSelectionChange: (productIds: string[]) => void
  initialSelection?: string[]
  searchPlaceholder?: string
  disabled?: boolean
  products?: Product[]
}

export interface ProductRowProps {
  product: Product
  isSelected?: boolean
  onSelect?: (product: Product) => void
  disabled?: boolean
  mode: 'single' | 'multi'
  userHasSpec?: boolean
  specCount?: number
  onCreateClick?: (productId: string) => void
  onEditClick?: (specificationId: string) => void
}

export interface SelectedProductsModalProps {
  isOpen: boolean
  onClose: () => void
  selectedProducts: Product[]
  onRemoveProduct: (productId: string) => void
  onClearAll: () => void
  onConfirm: () => void
}
