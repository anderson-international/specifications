import { EnumRepository } from '@/lib/repositories/enum-repository'
import { EnumValue, SpecificationEnumData } from '@/types/enum'

export async function getSpecificationEnumData(): Promise<SpecificationEnumData> {
  return EnumRepository.getAllEnumTables()
}

export async function getEnumData(tableName: string): Promise<EnumValue[]> {
  return EnumRepository.getEnumData(tableName)
}


