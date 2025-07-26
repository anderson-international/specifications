import { SpecificationReadRepository } from '@/lib/repositories/specification-read-repository'
import { ProductLookupService } from '@/lib/services/product-lookup-service'
import { type SpecificationWithRelations } from '@/lib/repositories/types/specification-types'
import { SpecificationTableBuilder } from '@/lib/utils/specification-table-builder'
import { AIConfidenceHelpers } from '@/lib/utils/ai-confidence-helpers'

export class SpecificationMarkdownService {
  static async generateMarkdown(id: number, userId?: string): Promise<string> {
    const specification = await SpecificationReadRepository.findById(id, userId)
    if (!specification) {
      throw new Error(`Specification with id ${id} not found`)
    }

    const specsWithProducts = await ProductLookupService.populateProductsInSpecs([specification])
    const enrichedSpec = specsWithProducts[0] as SpecificationWithRelations & {
      product: { handle: string; title: string; brand: string }
    }

    if (!enrichedSpec.product) {
      throw new Error(`Product data not found for specification ${id}`)
    }

    return this.formatSpecificationMarkdown(enrichedSpec)
  }

  private static formatSpecificationMarkdown(spec: SpecificationWithRelations & {
    product: { handle: string; title: string; brand: string }
  }): string {
    const productTitle = spec.product.title || 'Unknown Product'
    const rating = `${spec.star_rating || 0}/5 stars`
    
    const isAIGenerated = spec.ai_spec_metadata?.ai_model
    
    let markdown = `# ${productTitle}\n\n`
    
    if (isAIGenerated) {
      const confidenceLevel = AIConfidenceHelpers.getConfidenceLevel(spec.ai_spec_metadata?.confidence || 0)
      markdown += `> **AI Analysis**  \n`
      markdown += `> **Model:** ${spec.ai_spec_metadata?.ai_model || 'Unknown'} | **Confidence:** ${confidenceLevel} | **Generated:** ${AIConfidenceHelpers.formatDate(spec.ai_spec_metadata?.created_at?.toISOString())}\n\n`
    }
    
    markdown += `**Rating:** ${rating}\n\n`

    if (spec.review) {
      markdown += `## Review\n\n${spec.review}\n\n`
    }

    markdown += SpecificationTableBuilder.buildCharacteristicsTable(spec)

    if (isAIGenerated) {
      const confidenceLevel = AIConfidenceHelpers.getConfidenceLevel(spec.ai_spec_metadata?.confidence || 0)
      const confidenceContext = AIConfidenceHelpers.getConfidenceContext(spec.ai_spec_metadata?.confidence || 0)
      
      markdown += `\n## AI Generation Details\n\n`
      markdown += `| **Attribute** | **Value** |\n`
      markdown += `|:--------------|:----------|\n`
      markdown += `| Model | ${spec.ai_spec_metadata?.ai_model || 'Unknown'} |\n`
      markdown += `| Confidence Level | ${confidenceLevel} |\n`
      markdown += `| Confidence Context | ${confidenceContext} |\n`
      markdown += `| Generated | ${AIConfidenceHelpers.formatDate(spec.ai_spec_metadata?.created_at?.toISOString())} |\n`
      markdown += `| Last Updated | ${AIConfidenceHelpers.formatDate(spec.ai_spec_metadata?.updated_at?.toISOString())} |\n`
    }

    markdown += `\n---\n\n`
    
    if (isAIGenerated) {
      markdown += `*Professional AI specification synthesized from expert tobacco reviews*\n`
    } else {
      markdown += `*Specification created: ${spec.created_at?.toISOString().split('T')[0] || 'Unknown'}*  \n`
      markdown += `*Last updated: ${spec.updated_at?.toISOString().split('T')[0] || 'Unknown'}*\n`
    }

    return markdown
  }
}
