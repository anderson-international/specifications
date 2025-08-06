import { EnumValue } from '@/types/enum'

export interface PrismaEnumWithOrder {
  id: number
  name: string
  sort_order: number
}

export interface PrismaEnumWithoutOrder {
  id: number
  name: string
}

export class EnumMappers {
  static mapWithSortOrder(items: PrismaEnumWithOrder[]): EnumValue[] {
    return items.map((item): EnumValue => ({
      id: item.id,
      name: item.name,
      sort_order: item.sort_order
    }))
  }

  static mapWithoutSortOrder(items: PrismaEnumWithoutOrder[]): EnumValue[] {
    return items.map((item): EnumValue => ({
      id: item.id,
      name: item.name
    }))
  }

  static mapGenericEnum(item: { id: number; name: string; sort_order?: number }): EnumValue {
    return {
      id: item.id,
      name: item.name,
      sort_order: item.sort_order
    }
  }
}
