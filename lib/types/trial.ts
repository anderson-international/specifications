export interface TrialSupplierRef {
  id: number
  name: string
}

export interface TrialUserRef {
  id: string
  name: string | null
  email: string | null
}

export interface TrialTastingNoteRef {
  id: number
  name: string
}

export interface Trial {
  id: number
  product_name: string
  supplier_id: number
  rating: number
  review: string | null
  should_sell: boolean
  user_id: string | null
  supplier: TrialSupplierRef
  user?: TrialUserRef | null
  tasting_note_ids: number[]
  enums: {
    tastingNotes: TrialTastingNoteRef[]
  }
  created_at: string
  updated_at: string
}
