import { NextResponse } from 'next/server'
import { getSpecificationEnumData } from '@/lib/data/enums'
import { withErrorHandling } from '@/lib/api/utils'

export async function GET(): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const enumData = await getSpecificationEnumData()
    return enumData
  })
}
