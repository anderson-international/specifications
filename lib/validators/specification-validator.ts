export class SpecificationValidator {
  static validateUserId(userId: string | null): string | null {
    if (!userId) return 'User ID is required'
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return `Invalid userId format: expected UUID, got '${userId}'`
    }
    return null
  }

  static validateId(idString: string): { id: number; error: string | null } {
    if (!idString) return { id: 0, error: 'Valid specification ID is required' }
    const id = parseInt(idString, 10)
    if (isNaN(id)) return { id: 0, error: 'Valid specification ID is required' }
    return { id, error: null }
  }

  static validateCreateRequest(body: any): string | null {
    const { specification, junctionData } = body

    if (!specification?.shopify_handle || !specification?.user_id) {
      return 'Missing required fields: shopify_handle, user_id'
    }

    if (!specification.star_rating || specification.star_rating < 1 || specification.star_rating > 5) {
      return 'Star rating must be between 1 and 5'
    }

    if (!junctionData?.tasting_note_ids || junctionData.tasting_note_ids.length === 0) {
      return 'At least one tasting note is required'
    }

    return null
  }
}
