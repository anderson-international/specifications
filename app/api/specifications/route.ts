import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createApiError, withErrorHandling } from '@/lib/api/utils'

export async function GET(request: NextRequest): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const where = {
      ...(userId && { user_id: userId }),
      ...(status && { enum_specification_statuses: { name: status } }),
    }

    const [specifications, total] = await Promise.all([
      prisma.specifications.findMany({
        where,
        include: {
          users: {
            select: { id: true, name: true, email: true },
          },
          enum_specification_statuses: {
            select: { id: true, name: true },
          },
          enum_product_brands: {
            select: { id: true, name: true },
          },
        },
        skip,
        take: limit,
        orderBy: { updated_at: 'desc' },
      }),
      prisma.specifications.count({ where }),
    ])

    return {
      specifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const body = await request.json()
    const { specification, junctionData } = body

    // Validate required fields
    if (!specification?.shopify_handle || !specification?.user_id) {
      return createApiError('Missing required fields: shopify_handle, user_id', 400)
    }

    if (
      !specification.star_rating ||
      specification.star_rating < 1 ||
      specification.star_rating > 5
    ) {
      return createApiError('Star rating must be between 1 and 5', 400)
    }

    if (!junctionData?.tasting_note_ids || junctionData.tasting_note_ids.length === 0) {
      return createApiError('At least one tasting note is required', 400)
    }

    // Use atomic transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create the core specification
      const newSpecification = await tx.specifications.create({
        data: {
          shopify_handle: specification.shopify_handle,
          product_type_id: specification.product_type_id,
          is_fermented: specification.is_fermented,
          is_oral_tobacco: specification.is_oral_tobacco,
          is_artisan: specification.is_artisan,
          grind_id: specification.grind_id,
          nicotine_level_id: specification.nicotine_level_id,
          experience_level_id: specification.experience_level_id,
          review: specification.review,
          star_rating: specification.star_rating,
          rating_boost: specification.rating_boost,
          user_id: specification.user_id,
          moisture_level_id: specification.moisture_level_id,
          product_brand_id: specification.product_brand_id,
          status_id: specification.status_id,
        },
      })

      // Create junction table entries
      if (junctionData.tasting_note_ids.length > 0) {
        await tx.spec_tasting_notes.createMany({
          data: junctionData.tasting_note_ids.map((id: number) => ({
            specification_id: newSpecification.id,
            enum_tasting_note_id: id,
          })),
        })
      }

      if (junctionData.cure_ids.length > 0) {
        await tx.spec_cures.createMany({
          data: junctionData.cure_ids.map((id: number) => ({
            specification_id: newSpecification.id,
            enum_cure_id: id,
          })),
        })
      }

      if (junctionData.tobacco_type_ids.length > 0) {
        await tx.spec_tobacco_types.createMany({
          data: junctionData.tobacco_type_ids.map((id: number) => ({
            specification_id: newSpecification.id,
            enum_tobacco_type_id: id,
          })),
        })
      }

      // Return the created specification with relations
      return await tx.specifications.findUnique({
        where: { id: newSpecification.id },
        include: {
          users: {
            select: { id: true, name: true, email: true },
          },
          enum_specification_statuses: {
            select: { id: true, name: true },
          },
          enum_product_brands: {
            select: { id: true, name: true },
          },
          spec_tasting_notes: {
            include: {
              enum_tasting_notes: {
                select: { id: true, name: true },
              },
            },
          },
          spec_cures: {
            include: {
              enum_cures: {
                select: { id: true, name: true },
              },
            },
          },
          spec_tobacco_types: {
            include: {
              enum_tobacco_types: {
                select: { id: true, name: true },
              },
            },
          },
        },
      })
    })

    return result
  })
}
