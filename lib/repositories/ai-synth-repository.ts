import { AISynthReadRepository } from './ai-synth-read-repository'
import { AISynthWriteRepository } from './ai-synth-write-repository'
import { AISynthSourcesRepository } from './ai-synth-sources-repository'
import { 
  AISynthWithRelations, 
  AISynthFilterOptions, 
  CreateAISynthData, 
  AISynthSourceData 
} from './types/ai-synth-types'

export class AISynthRepository {
  static async findMany(filters?: AISynthFilterOptions): Promise<AISynthWithRelations[]> {
    return AISynthReadRepository.findMany(filters)
  }

  static async findByShopifyHandle(
    shopifyHandle: string
  ): Promise<AISynthWithRelations | null> {
    return AISynthReadRepository.findByShopifyHandle(shopifyHandle)
  }

  static async create(
    data: CreateAISynthData,
    sources: AISynthSourceData[]
  ): Promise<AISynthWithRelations> {
    return AISynthWriteRepository.create(data, sources)
  }

  static async update(
    shopifyHandle: string,
    data: Partial<CreateAISynthData>,
    sources?: AISynthSourceData[]
  ): Promise<AISynthWithRelations> {
    return AISynthWriteRepository.update(shopifyHandle, data, sources)
  }

  static async getSources(shopifyHandle: string): Promise<AISynthWithRelations['ai_spec_sources']> {
    return AISynthSourcesRepository.getSources(shopifyHandle)
  }
}
