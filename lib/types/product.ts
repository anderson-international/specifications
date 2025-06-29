// Canonical Product Type Definition
// This is the single source of truth for Product types across the entire application

export interface Product {
  id: string;
  handle: string; 
  title: string;
  brand: string;
  image_url: string | null;
  spec_count_total: number;
}

export interface CacheStats {
  totalProducts: number;
  cacheSize: number;
  lastUpdated: string;
  isValid: boolean;
}
