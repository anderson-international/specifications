import { NextRequest, NextResponse } from 'next/server'
import { getSpecificationEnumData } from '@/lib/data/enums'

/**
 * Direct Database Enum Endpoint
 * Bypasses Redis cache entirely to test if issue is cache-specific
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    // Fetch enum data directly from database, bypassing Redis
    const enumData = await getSpecificationEnumData()
    
    const response = {
      data: enumData,
      source: 'direct_database',
      cached: false,
    }
    
    return NextResponse.json(response)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        error: 'Direct database enum operation failed',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
