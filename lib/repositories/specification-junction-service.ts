import { Prisma } from '@prisma/client'

export class SpecificationJunctionService {
  static async createJunctionData(
    tx: Prisma.TransactionClient,
    specificationId: number,
    junctionData: { tasting_note_ids: number[]; cure_ids: number[]; tobacco_type_ids: number[] }
  ): Promise<void> {
    const promises = []
    
    if (junctionData.tasting_note_ids.length > 0) {
      promises.push(tx.spec_junction_tasting_notes.createMany({
        data: junctionData.tasting_note_ids.map(id => ({ specification_id: specificationId, enum_tasting_note_id: id })),
        skipDuplicates: true,
      }))
    }
    
    if (junctionData.cure_ids.length > 0) {
      promises.push(tx.spec_junction_cures.createMany({
        data: junctionData.cure_ids.map(id => ({ specification_id: specificationId, enum_cure_id: id })),
        skipDuplicates: true,
      }))
    }
    
    if (junctionData.tobacco_type_ids.length > 0) {
      promises.push(tx.spec_junction_tobacco_types.createMany({
        data: junctionData.tobacco_type_ids.map(id => ({ specification_id: specificationId, enum_tobacco_type_id: id })),
        skipDuplicates: true,
      }))
    }
    
    await Promise.all(promises)
  }

  static async clearJunctionData(
    tx: Prisma.TransactionClient,
    specificationId: number
  ): Promise<void> {
    await Promise.all([
      tx.spec_junction_tasting_notes.deleteMany({ where: { specification_id: specificationId } }),
      tx.spec_junction_cures.deleteMany({ where: { specification_id: specificationId } }),
      tx.spec_junction_tobacco_types.deleteMany({ where: { specification_id: specificationId } }),
    ])
  }
}
