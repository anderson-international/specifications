import { TrialReadRepository } from '@/lib/repositories/trial-read-repository'
import { TrialWriteRepository } from '@/lib/repositories/trial-write-repository'
import type { TrialReviewWithRelations } from '@/lib/repositories/types/trial-types'
import { transformTrialForCreate, transformTrialForUpdate } from './trial-transformers-db'
import { transformTrialToApiResponse, type TrialApiResponse } from './trial-transformers-api'

export class TrialService {
  static async getTrials(): Promise<TrialApiResponse[]> {
    const trials = await TrialReadRepository.findMany()
    return trials.map(transformTrialToApiResponse)
  }

  static async getTrialById(id: bigint, userId?: string | null): Promise<TrialApiResponse> {
    const trial = await TrialReadRepository.findById(id, userId || undefined)
    if (!trial) {
      throw new Error(`Trial not found: id=${id.toString()}, userId=${userId}`)
    }
    return transformTrialToApiResponse(trial)
  }

  static async createTrial(
    trialInput: Record<string, unknown>,
    junctionData: Record<string, unknown>
  ): Promise<TrialApiResponse> {
    const created: TrialReviewWithRelations = await TrialWriteRepository.create(
      transformTrialForCreate(trialInput),
      junctionData?.tasting_note_ids as number[]
    )
    return transformTrialToApiResponse(created)
  }

  static async updateTrial(
    id: bigint,
    body: Record<string, unknown>
  ): Promise<{ id: number; user_id: string | null; updated_at: Date | null }> {
    const updated = await TrialWriteRepository.update(
      id,
      transformTrialForUpdate(body),
      body?.tasting_note_ids as number[] | undefined
    )
    return { id: Number(updated.id), user_id: updated.user_id, updated_at: updated.updated_at }
  }

  static async deleteTrial(id: bigint): Promise<void> {
    await TrialWriteRepository.delete(id)
  }
}
