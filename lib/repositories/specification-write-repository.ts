import { prisma } from '@/lib/prisma'
import { SPECIFICATION_INCLUDE } from './includes/specification-include'
import { SpecificationJunctionService } from './specification-junction-service'
import { 
  SpecificationWithRelations, 
  CreateSpecificationData, 
  JunctionData 
} from './types/specification-types'

export class SpecificationWriteRepository {
  static async create(
    data: CreateSpecificationData,
    junctionData: JunctionData
  ): Promise<SpecificationWithRelations> {
    return prisma.$transaction(async (tx) => {
      const newSpec = await tx.specifications.create({ data })

      await SpecificationJunctionService.createJunctionData(tx, newSpec.id, junctionData)

      return tx.specifications.findUniqueOrThrow({
        where: { id: newSpec.id },
        include: SPECIFICATION_INCLUDE,
      })
    })
  }

  static async update(
    id: number,
    data: Partial<CreateSpecificationData>,
    junctionData?: Partial<JunctionData>
  ): Promise<{ id: number; user_id: string; updated_at: Date | null }> {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.specifications.update({
        where: { id },
        data: { ...data, updated_at: new Date() },
      })

      if (junctionData) {
        await SpecificationJunctionService.clearJunctionData(tx, id)
        
        const fullJunctionData = {
          tasting_note_ids: junctionData.tasting_note_ids || [],
          cure_ids: junctionData.cure_ids || [],
          tobacco_type_ids: junctionData.tobacco_type_ids || [],
        }
        
        await SpecificationJunctionService.createJunctionData(tx, id, fullJunctionData)
      }

      return updated
    })
  }
}
