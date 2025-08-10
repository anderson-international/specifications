export const TRIAL_INCLUDE = {
  system_users: { select: { id: true, name: true, email: true } },
  trial_products: {
    select: {
      id: true,
      name: true,
      brand_id: true,
      trial_product_brands: { select: { id: true, name: true } },
    },
  },
  trial_junction_tasting_notes: {
    include: {
      spec_enum_tasting_notes: { select: { id: true, name: true } },
    },
  },
} as const
