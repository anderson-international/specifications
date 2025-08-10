export class TrialValidator {
  static validateUserId(userId: string | null): string | null {
    if (!userId) return 'User ID is required'
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return `Invalid userId format: expected UUID, got '${userId}'`
    }
    return null
  }

  static validateId(idString: string): { id: bigint; error: string | null } {
    if (!idString || !/^\d+$/.test(idString)) return { id: BigInt(0), error: 'Valid trial ID is required' }
    const parsed = BigInt(idString)
    if (parsed < BigInt(1)) return { id: BigInt(0), error: 'Valid trial ID is required' }
    return { id: parsed, error: null }
  }

  static validateCreateRequest(body: Record<string, unknown>): string | null {
    const trial = body?.trial as Record<string, unknown> | undefined
    if (!trial) return 'Missing required object: trial'

    const required = ['product_name', 'supplier_id', 'rating', 'should_sell', 'user_id']
    for (const key of required) {
      if (trial[key] === undefined || trial[key] === null) return `Missing required field: ${key}`
    }

    const rating = trial.rating as number
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return 'Rating must be between 1 and 5'
    }

    const userId = trial.user_id as string
    const userErr = this.validateUserId(userId)
    if (userErr) return userErr

    const junction = body?.junctionData as { tasting_note_ids?: unknown } | undefined
    if (!junction) return 'Missing required object: junctionData'
    if (!Array.isArray(junction.tasting_note_ids)) return 'tasting_note_ids must be an array'

    return null
  }
}
