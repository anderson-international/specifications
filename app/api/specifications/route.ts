import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createApiError, withErrorHandling } from '@/lib/api/utils'

export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const where = {
      ...(userId && { user_id: userId }),
      ...(status && { enum_specification_statuses: { name: status } })
    }

    const [specifications, total] = await Promise.all([
      prisma.specifications.findMany({
        where,
        include: {
          users: {
            select: { id: true, name: true, email: true }
          },
          enum_specification_statuses: {
            select: { id: true, name: true }
          },
          enum_product_brands: {
            select: { id: true, name: true }
          }
        },
        skip,
        take: limit,
        orderBy: { updated_at: 'desc' }
      }),
      prisma.specifications.count({ where })
    ])

    return {
      specifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  })
}

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const body = await request.json()
    
    // Basic validation - full validation would use Zod schemas
    const { shopify_handle, user_id, ...specData } = body
    
    if (!shopify_handle || !user_id) {
      return createApiError('Missing required fields: shopify_handle, user_id', 400)
    }

    const specification = await prisma.specifications.create({
      data: {
        shopify_handle,
        user_id,
        ...specData,
        status_id: 1 // Default to draft
      },
      include: {
        users: {
          select: { id: true, name: true, email: true }
        },
        enum_specification_statuses: {
          select: { id: true, name: true }
        }
      }
    })

    return specification
  })
}
