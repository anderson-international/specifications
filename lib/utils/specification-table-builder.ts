import { type SpecificationWithRelations } from '@/lib/repositories/types/specification-types'
import { buildCharacteristicsTable } from './specification-table'

export class SpecificationTableBuilder {

  static buildCharacteristicsTable(spec: SpecificationWithRelations): string {
    return buildCharacteristicsTable(spec)
  }
}
