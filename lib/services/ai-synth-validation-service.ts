import { AISynthRepository } from '@/lib/repositories/ai-synth-repository'

export class AISynthValidationService {
  static async validateForGeneration(shopifyHandle: string): Promise<void> {
    const existing = await AISynthRepository.findByShopifyHandle(shopifyHandle)
    if (existing) {
      throw new Error(`AI synthesis already exists for product: ${shopifyHandle}`)
    }
  }

  static async validateForRefresh(shopifyHandle: string): Promise<void> {
    const existing = await AISynthRepository.findByShopifyHandle(shopifyHandle)
    if (!existing) {
      throw new Error(`AI synthesis not found for product: ${shopifyHandle}`)
    }
  }
}
