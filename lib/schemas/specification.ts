export interface Specification {
  id?: number;
  shopify_handle: string;
  product_type_id: number;
  is_fermented?: boolean;
  is_oral_tobacco?: boolean;
  is_artisan?: boolean;
  grind_id: number;
  nicotine_level_id: number;
  experience_level_id: number;
  review?: string;
  star_rating?: number;
  rating_boost?: number;
  created_at?: Date;
  updated_at?: Date;
  user_id: string;
  moisture_level_id: number;
  product_brand_id: number;
  tasting_note_ids: number[];
  cure_type_ids: number[];
  tobacco_type_ids: number[];
  submission_id?: string;
  status_id: number;
}
