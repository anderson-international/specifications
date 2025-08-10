import { Prisma } from '@prisma/client'

export class TrialJunctionService {
  static async createTastingNotes(
    tx: Prisma.TransactionClient,
    trialReviewId: bigint,
    tastingNoteIds: number[]
  ): Promise<void> {
    if (!tastingNoteIds || tastingNoteIds.length === 0) return
    await tx.trial_junction_tasting_notes.createMany({
      data: tastingNoteIds.map((id) => ({ trial_review_id: trialReviewId, tasting_note_id: id })),
      skipDuplicates: true,
    })
  }

  static async clearTastingNotes(
    tx: Prisma.TransactionClient,
    trialReviewId: bigint
  ): Promise<void> {
    await tx.trial_junction_tasting_notes.deleteMany({ where: { trial_review_id: trialReviewId } })
  }
}
