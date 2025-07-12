import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createApiError, withErrorHandling } from '@/lib/api/utils'
import { Prisma } from '@prisma/client'

// Define the type for specifications query with all included relations
type SpecificationWithRelations = Prisma.specificationsGetPayload<{
  include: {
    users: {
      select: { id: true, name: true, email: true }
    },
    enum_specification_statuses: {
      select: { id: true, name: true }
    },
    enum_product_brands: {
      select: { id: true, name: true }
    },
    enum_product_types: {
      select: { id: true, name: true }
    },
    enum_experience_levels: {
      select: { id: true, name: true }
    },
    enum_grinds: {
      select: { id: true, name: true }
    },
    enum_nicotine_levels: {
      select: { id: true, name: true }
    },
    enum_moisture_levels: {
      select: { id: true, name: true }
    },
    spec_tasting_notes: {
      include: {
        enum_tasting_notes: {
          select: { id: true, name: true }
        }
      }
    },
    spec_cures: {
      include: {
        enum_cures: {
          select: { id: true, name: true }
        }
      }
    },
    spec_tobacco_types: {
      include: {
        enum_tobacco_types: {
          select: { id: true, name: true }
        }
      }
    }
  }
}>

interface GetParams {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: GetParams
): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!id) {
      return createApiError('Specification ID is required', 400)
    }

    const specification = await prisma.specifications.findFirst({
      where: {
        id,
        ...(userId && { user_id: userId }), // Optional user ownership check
      },
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
        enum_product_types: {
          select: { id: true, name: true },
        },
        enum_experience_levels: {
          select: { id: true, name: true },
        },
        enum_grinds: {
          select: { id: true, name: true },
        },
        enum_nicotine_levels: {
          select: { id: true, name: true },
        },
        enum_moisture_levels: {
          select: { id: true, name: true },
        },
        // Junction tables with their related enum data
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

    if (!specification) {
      return createApiError('Specification not found', 404)
    }

    // Transform the specification data to match expected frontend format
    // specification has proper typing from Prisma GetPayload utility
    const transformedSpec = {
      id: specification.id,
      userId: specification.user_id,
      status: specification.enum_specification_statuses?.name || 'unknown',
      createdAt: specification.created_at?.toISOString(),
      updatedAt: specification.updated_at?.toISOString(),
      lastModified: specification.updated_at?.toISOString(),

      // Form data fields (SpecificationFormData format)
      shopify_handle: specification.shopify_handle,
      product_brand_id: specification.product_brand_id,
      product_type_id: specification.product_type_id,
      experience_level_id: specification.experience_level_id,
      grind_id: specification.grind_id,
      nicotine_level_id: specification.nicotine_level_id,
      moisture_level_id: specification.moisture_level_id,
      is_fermented: specification.is_fermented,
      is_oral_tobacco: specification.is_oral_tobacco,
      is_artisan: specification.is_artisan,
      review_text: specification.review_text,
      star_rating: specification.star_rating,
      rating_boost: specification.rating_boost,
      enums: {
        status: specification.enum_specification_statuses || null,
        brand: specification.enum_product_brands || null,
        productType: specification.enum_product_types || null,
        experienceLevel: specification.enum_experience_levels || null,
        grind: specification.enum_grinds || null,
        nicotineLevel: specification.enum_nicotine_levels || null,
        moistureLevel: specification.enum_moisture_levels || null,
        tastingNotes: specification.spec_tasting_notes?.map(stn => stn.enum_tasting_notes) || [],
        cures: specification.spec_cures?.map(sc => sc.enum_cures) || [],
        tobaccoTypes: specification.spec_tobacco_types?.map(stt => stt.enum_tobacco_types) || [],
      },
    }

    return NextResponse.json({
      specification: transformedSpec,
      success: true,
    })
  })
}

export async function PUT(
  request: NextRequest,
  { params }: GetParams
): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { id } = params
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!id) {
      return createApiError('Specification ID is required', 400)
    }

    if (!userId) {
      return createApiError('User ID is required', 400)
    }

    // Verify specification exists and belongs to user
    const existingSpec = await prisma.specifications.findFirst({
      where: {
        id,
        user_id: userId,
      },
    })

    if (!existingSpec) {
      return createApiError('Specification not found or unauthorized', 404)
    }

    // Use transaction to update specification and junction tables
    const result = await prisma.$transaction(async (tx) => {
      // Update main specification record
      const updatedSpec = await tx.specifications.update({
        where: { id },
        data: {
          shopify_handle: body.shopify_handle,
          product_brand_id: body.product_brand_id,
          product_type_id: body.product_type_id,
          experience_level_id: body.experience_level_id,
          grind_id: body.grind_id,
          nicotine_level_id: body.nicotine_level_id,
          moisture_level_id: body.moisture_level_id,
          is_fermented: body.is_fermented,
          is_oral_tobacco: body.is_oral_tobacco,
          is_artisan: body.is_artisan,
          review_text: body.review_text,
          star_rating: body.star_rating,
          rating_boost: body.rating_boost,
          status_id: body.status_id,
          updated_at: new Date(),
        },
      })

      // Delete existing junction table entries
      await Promise.all([
        tx.spec_tasting_notes.deleteMany({ where: { specification_id: id } }),
        tx.spec_cures.deleteMany({ where: { specification_id: id } }),
        tx.spec_tobacco_types.deleteMany({ where: { specification_id: id } }),
      ])

      // Create new junction table entries
      if (body.tasting_note_ids?.length > 0) {
        await tx.spec_tasting_notes.createMany({
          data: body.tasting_note_ids.map((noteId: number) => ({
            specification_id: id,
            tasting_note_id: noteId,
          })),
        })
      }

      if (body.cure_type_ids?.length > 0) {
        await tx.spec_cures.createMany({
          data: body.cure_type_ids.map((cureId: number) => ({
            specification_id: id,
            cure_id: cureId,
          })),
        })
      }

      if (body.tobacco_type_ids?.length > 0) {
        await tx.spec_tobacco_types.createMany({
          data: body.tobacco_type_ids.map((tobaccoId: number) => ({
            specification_id: id,
            tobacco_type_id: tobaccoId,
          })),
        })
      }

      return updatedSpec
    })

    return NextResponse.json({
      specification: {
        id: result.id,
        userId: result.user_id,
        updatedAt: result.updated_at?.toISOString(),
      },
      success: true,
      message: 'Specification updated successfully',
    })
  })
}
