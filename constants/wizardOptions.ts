/**
 * Schema-aligned mock data for wizard form options
 * All values match the exact database enum tables from db-schema.md
 */

// enum_product_types (8 options)
export const PRODUCT_TYPES = [
  { id: 1, value: 1, label: 'Tobacco Snuff' },
  { id: 2, value: 2, label: 'Chew Bag' },
  { id: 3, value: 3, label: 'Oral Tobacco' },
  { id: 4, value: 4, label: 'Glucose Snuff' },
  { id: 5, value: 5, label: 'Accessory' },
  { id: 6, value: 6, label: 'Nicotine Pouch' },
  { id: 7, value: 7, label: 'Herbal Snuff' },
  { id: 8, value: 8, label: 'Nasal Snuff' }
] as const

// enum_grinds (6 options)
export const GRINDS = [
  { id: 1, value: 1, label: 'Fine' },
  { id: 2, value: 2, label: 'Medium Fine' },
  { id: 3, value: 3, label: 'Medium' },
  { id: 4, value: 4, label: 'Medium Course' },
  { id: 5, value: 5, label: 'Course' },
  { id: 6, value: 6, label: 'Small Pellets' }
] as const

// enum_experience_levels (3 options)
export const EXPERIENCE_LEVELS = [
  { id: 1, value: 1, label: 'Beginner' },
  { id: 2, value: 2, label: 'Intermediate' },
  { id: 3, value: 3, label: 'Experienced' }
] as const

// enum_nicotine_levels (6 options) - CORRECTED from old 4-option mock
export const NICOTINE_LEVELS = [
  { id: 1, value: 1, label: 'None' },
  { id: 2, value: 2, label: 'Low' },
  { id: 3, value: 3, label: 'Low-Medium' },
  { id: 4, value: 4, label: 'Medium' },
  { id: 5, value: 5, label: 'Medium-High' },
  { id: 6, value: 6, label: 'High' }
] as const

// enum_moisture_levels (4 options) - CORRECTED from old 3-option mock
export const MOISTURE_LEVELS = [
  { id: 1, value: 1, label: 'Very Dry' },
  { id: 2, value: 2, label: 'Dry' },
  { id: 3, value: 3, label: 'Slightly Moist' },
  { id: 4, value: 4, label: 'Moist' }
] as const

// enum_product_brands (43 options) - Sample of major brands for mock data
export const PRODUCT_BRANDS = [
  { id: 1, value: 1, label: 'McChrystals' },
  { id: 2, value: 2, label: 'Mullins & Westley' },
  { id: 3, value: 3, label: 'NTSU' },
  { id: 4, value: 4, label: 'Gawith Hoggarth' },
  { id: 5, value: 5, label: 'Samuel Gawith' },
  { id: 6, value: 6, label: 'Toque' },
  { id: 7, value: 7, label: 'Wilson of Sharrow' },
  { id: 8, value: 8, label: 'Fribourg & Treyer' },
  { id: 9, value: 9, label: 'Bernard' },
  { id: 10, value: 10, label: 'Dholakia' }
  // Note: Full 43 brands available in schema - using subset for mock
] as const

// enum_cures (5 options)
export const CURES = [
  { id: 1, value: 1, label: 'Air Cured' },
  { id: 2, value: 2, label: 'Fire Cured' },
  { id: 3, value: 3, label: 'Flue Cured' },
  { id: 4, value: 4, label: 'Sun Cured' },
  { id: 5, value: 5, label: 'Toasted' }
] as const

// enum_tasting_notes (80 options) - Sample for mock data
export const TASTING_NOTES = [
  { id: 1, value: 1, label: 'Almond' },
  { id: 2, value: 2, label: 'Ammonia' },
  { id: 3, value: 3, label: 'Anise' },
  { id: 4, value: 4, label: 'Apple' },
  { id: 5, value: 5, label: 'Apricot' },
  { id: 6, value: 6, label: 'Bergamot' },
  { id: 7, value: 7, label: 'Berry' },
  { id: 8, value: 8, label: 'Blackcurrant' },
  { id: 9, value: 9, label: 'Caramel' },
  { id: 10, value: 10, label: 'Cherry' },
  { id: 11, value: 11, label: 'Chocolate' },
  { id: 12, value: 12, label: 'Cinnamon' },
  { id: 13, value: 13, label: 'Citrus' },
  { id: 14, value: 14, label: 'Coffee' },
  { id: 15, value: 15, label: 'Eucalyptus' },
  { id: 16, value: 16, label: 'Floral' },
  { id: 17, value: 17, label: 'Honey' },
  { id: 18, value: 18, label: 'Lavender' },
  { id: 19, value: 19, label: 'Lemon' },
  { id: 20, value: 20, label: 'Menthol' },
  { id: 21, value: 21, label: 'Mint' },
  { id: 22, value: 22, label: 'Orange' },
  { id: 23, value: 23, label: 'Rose' },
  { id: 24, value: 24, label: 'Spicy' },
  { id: 25, value: 25, label: 'Vanilla' }
  // Note: Full 80 tasting notes available in schema - using subset for mock
] as const

// enum_tobacco_types (26 options) - Sample for mock data
export const TOBACCO_TYPES = [
  { id: 1, value: 1, label: 'Bahia' },
  { id: 2, value: 2, label: 'Basma' },
  { id: 3, value: 3, label: 'Brazilian' },
  { id: 4, value: 4, label: 'Burley' },
  { id: 5, value: 5, label: 'Connecticut' },
  { id: 6, value: 6, label: 'Dark Air Cured' },
  { id: 7, value: 7, label: 'Dark Fire Cured' },
  { id: 8, value: 8, label: 'Flue Cured' },
  { id: 9, value: 9, label: 'Latakia' },
  { id: 10, value: 10, label: 'Oriental' },
  { id: 11, value: 11, label: 'Perique' },
  { id: 12, value: 12, label: 'Turkish' },
  { id: 13, value: 13, label: 'Virginia' }
  // Note: Full 26 tobacco types available in schema - using subset for mock
] as const

// Mock products for ProductSelection step
export const MOCK_PRODUCTS = [
  {
    id: 1,
    shopify_handle: 'mcchrystals-original-genuine',
    name: "McChrystal's Original & Genuine",
    brand_id: 1,
    brand_name: 'McChrystals',
    image_url: '/images/products/mcchrystals-original.jpg',
    price: '£4.50',
    in_stock: true,
    reviewed: false
  },
  {
    id: 2,
    shopify_handle: 'gawith-hoggarth-kendal-brown',
    name: 'Gawith Hoggarth Kendal Brown',
    brand_id: 4,
    brand_name: 'Gawith Hoggarth',
    image_url: '/images/products/gh-kendal-brown.jpg',
    price: '£3.95',
    in_stock: true,
    reviewed: true
  },
  {
    id: 3,
    shopify_handle: 'toque-whisky-and-honey',
    name: 'Toque Whisky & Honey',
    brand_id: 6,
    brand_name: 'Toque',
    image_url: '/images/products/toque-whisky-honey.jpg',
    price: '£4.25',
    in_stock: false,
    reviewed: false
  },
  {
    id: 4,
    shopify_handle: 'wilson-best-sp-no6',
    name: 'Wilson Best SP No.6',
    brand_id: 7,
    brand_name: 'Wilson of Sharrow',
    image_url: '/images/products/wilson-best-sp6.jpg',
    price: '£3.50',
    in_stock: true,
    reviewed: false
  }
] as const

// Star rating options for ReviewSubmission step
export const STAR_RATINGS = [
  { id: 1, value: 1, label: '1 Star - Poor' },
  { id: 2, value: 2, label: '2 Stars - Fair' },
  { id: 3, value: 3, label: '3 Stars - Good' },
  { id: 4, value: 4, label: '4 Stars - Very Good' },
  { id: 5, value: 5, label: '5 Stars - Excellent' }
] as const

// Type exports for TypeScript
export type ProductType = typeof PRODUCT_TYPES[number]
export type Grind = typeof GRINDS[number]
export type ExperienceLevel = typeof EXPERIENCE_LEVELS[number]
export type NicotineLevel = typeof NICOTINE_LEVELS[number]
export type MoistureLevel = typeof MOISTURE_LEVELS[number]
export type ProductBrand = typeof PRODUCT_BRANDS[number]
export type Cure = typeof CURES[number]
export type TastingNote = typeof TASTING_NOTES[number]
export type TobaccoType = typeof TOBACCO_TYPES[number]
export type MockProduct = typeof MOCK_PRODUCTS[number]
export type StarRating = typeof STAR_RATINGS[number]
