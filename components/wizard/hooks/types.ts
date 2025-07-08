export interface EnumOption {
  id: number
  value: number
  label: string
}

export interface EnumHookResult {
  data: EnumOption[] | undefined
  isLoading: boolean
  error: Error | null
}
