/**
 * Check roles and users in database
 * Usage: node docs/test/check-roles.js
 */

require('dotenv').config({ quiet: true })

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkRolesAndUsers() {
  console.log('🔍 Checking roles and users in database')
  console.log('=====================================\n')
  
  try {
    // Check all roles
    const roles = await prisma.system_enum_roles.findMany({
      orderBy: { id: 'asc' }
    })
    
    console.log('📋 Available roles:')
    roles.forEach(role => {
      console.log(`   ${role.id}: "${role.name}"`)
    })
    
    console.log('\n👥 All users with their roles:')
    const users = await prisma.system_users.findMany({
      include: {
        system_enum_roles: true
      },
      orderBy: { created_at: 'asc' }
    })
    
    users.forEach(user => {
      console.log(`   ${user.name || 'No name'} (${user.email})`)
      console.log(`      Role: "${user.system_enum_roles.name}" (ID: ${user.role_id})`)
      console.log(`      User ID: ${user.id}`)
      console.log()
    })
    
    // Check specifically for AI role
    console.log('🤖 Looking for AI role specifically...')
    const aiRole = roles.find(r => r.name === 'AI')
    if (aiRole) {
      console.log(`✅ AI role found: ID ${aiRole.id}`)
      
      const aiUsers = users.filter(u => u.role_id === aiRole.id)
      if (aiUsers.length > 0) {
        console.log(`✅ Found ${aiUsers.length} user(s) with AI role:`)
        aiUsers.forEach(user => {
          console.log(`   - ${user.name} (${user.email}) - ID: ${user.id}`)
        })
      } else {
        console.log('❌ No users found with AI role')
      }
    } else {
      console.log('❌ AI role not found in database')
      console.log('💡 Available role names:', roles.map(r => r.name).join(', '))
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkRolesAndUsers().catch(console.error)
