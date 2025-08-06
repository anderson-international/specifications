export interface EnumValue {
  id: number
  name: string
  sort_order?: number
}

export interface EnumQueryOptions {
  search?: string
  page?: number
  limit?: number
}

export interface EnumQueryResult {
  data: EnumValue[]
  total: number
  page: number
  limit: number
  totalPages: number
}
