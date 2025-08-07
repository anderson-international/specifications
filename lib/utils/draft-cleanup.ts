import { deleteDraft, getAllUserDrafts } from './draft-operations'

const MAX_DRAFT_AGE_DAYS = 7
const MAX_DRAFTS_PER_USER = 5

export function cleanupOldDrafts(userId: string): void {
  const drafts = getAllUserDrafts(userId)
  const maxAge = MAX_DRAFT_AGE_DAYS * 24 * 60 * 60 * 1000
  const now = Date.now()

  drafts.forEach(draft => {
    const lastSaved = new Date(draft.lastSaved).getTime()
    if (now - lastSaved > maxAge) {
      deleteDraft(draft.userId, draft.productHandle)
    }
  })

  const validDrafts = getAllUserDrafts(userId)
  if (validDrafts.length > MAX_DRAFTS_PER_USER) {
    const draftsToRemove = validDrafts.slice(MAX_DRAFTS_PER_USER)
    draftsToRemove.forEach(draft => {
      deleteDraft(draft.userId, draft.productHandle)
    })
  }
}
