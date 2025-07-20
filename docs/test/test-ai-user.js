/**
 * Test AI User Service
 * Usage: node docs/test/test-ai-user.js
 */

require('dotenv').config({ quiet: true })

// Since this is a test file, we can use Node.js require with TS files
const { AIUserService } = require('../../lib/services/ai-user-service.ts')

async function testAIUser() {
  console.log('🤖 Testing AI User Service')
  console.log('===========================\n')
  
  try {
    const aiUserId = await AIUserService.getAIUser()
    
    console.log('✅ AI User found!')
    console.log('   User ID:', aiUserId)
    
    // Let's also fetch the full user details to verify the role
    const { prisma } = require('../../lib/prisma.ts')
    
    const userDetails = await prisma.system_users.findUnique({
      where: { id: aiUserId },
      include: {
        system_enum_roles: true
      }
    })
    
    if (userDetails) {
      console.log('   User Details:')
      console.log('   - Name:', userDetails.name)
      console.log('   - Email:', userDetails.email)
      console.log('   - Role:', userDetails.system_enum_roles.name)
      console.log('   - Role ID:', userDetails.role_id)
      
      if (userDetails.system_enum_roles.name === 'AI') {
        console.log('✅ Correct AI role confirmed!')
      } else {
        console.log('❌ Warning: User role is not "AI"')
      }
    }
    
  } catch (error) {
    console.log('❌ Error finding AI user:')
    console.log('   Error:', error.message)
    
    // Let's check what roles exist in the database
    try {
      const { prisma } = require('../../lib/prisma.ts')
      const roles = await prisma.system_enum_roles.findMany()
      
      console.log('\n📋 Available roles in database:')
      roles.forEach(role => {
        console.log(`   - ${role.name} (ID: ${role.id})`)
      })
      
      const users = await prisma.system_users.findMany({
        include: {
          system_enum_roles: true
        }
      })
      
      console.log('\n👥 All users in database:')
      users.forEach(user => {
        console.log(`   - ${user.name || 'No name'} (${user.email}) - Role: ${user.system_enum_roles.name}`)
      })
      
    } catch (dbError) {
      console.log('❌ Could not check database:', dbError.message)
    }
  }
}

testAIUser().catch(console.error)
