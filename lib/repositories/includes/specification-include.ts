export const SPECIFICATION_INCLUDE = {
  system_users: { select: { id: true, name: true, email: true } },
  spec_enum_statuses: { select: { id: true, name: true } },
  product_enum_brands: { select: { id: true, name: true } },
  spec_enum_experience: { select: { id: true, name: true } },
  spec_enum_grinds: { select: { id: true, name: true } },
  spec_enum_moisture: { select: { id: true, name: true } },
  spec_enum_nicotine: { select: { id: true, name: true } },
  ai_spec_metadata: { select: { ai_model: true, confidence: true, created_at: true, updated_at: true } },
  spec_junction_cures: {
    include: {
      spec_enum_cures: { select: { id: true, name: true } },
    },
  },
  spec_junction_tasting_notes: {
    include: {
      spec_enum_tasting_notes: { select: { id: true, name: true } },
    },
  },
  spec_junction_tobacco_types: {
    include: {
      spec_enum_tobacco_types: { select: { id: true, name: true } },
    },
  },
} as const
