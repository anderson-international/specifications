import { withErrorHandling } from '@/lib/api/api-errors'
import { TrialBrandReadRepository } from '@/lib/repositories/trial-brand-read-repository'

export async function GET() {
  return withErrorHandling(async () => {
    const rows = await TrialBrandReadRepository.findMany()
    const brands = rows.map((r) => ({ id: Number(r.id), name: r.name }))
    return { brands }
  })
}
