const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugAISpecs() {
  try {
    console.log('🔍 Debugging AI Specifications...')
    console.log('=' .repeat(50))

    const totalSpecs = await prisma.specifications.count()
    console.log(`📊 Total specifications: ${totalSpecs}`)

    const aiMetadataCount = await prisma.ai_spec_metadata.count()
    console.log(`🤖 AI metadata records: ${aiMetadataCount}`)

    if (aiMetadataCount > 0) {
      console.log('\n📋 AI Metadata Records:')
      const aiMetadata = await prisma.ai_spec_metadata.findMany({
        select: {
          specification_id: true,
          ai_model: true,
          confidence: true,
          created_at: true,
          updated_at: true
        }
      })
      console.table(aiMetadata)
    }

    console.log('\n🔍 Testing AISpecificationService query...')
    const aiSpecs = await prisma.specifications.findMany({
      where: {
        ai_spec_metadata: {
          isNot: null
        }
      },
      include: {
        ai_spec_metadata: {
          select: {
            ai_model: true,
            confidence: true,
            created_at: true,
            updated_at: true
          }
        }
      },
      orderBy: {
        updated_at: 'desc'
      }
    })

    console.log(`🎯 AI specs found by service query: ${aiSpecs.length}`)
    
    if (aiSpecs.length > 0) {
      console.log('✅ Sample AI spec data:')
      console.log(JSON.stringify(aiSpecs[0], null, 2))
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

debugAISpecs()
