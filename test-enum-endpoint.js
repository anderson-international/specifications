// Test script to isolate enum endpoint issues
// Run with: node test-enum-endpoint.js

const BASE_URL = 'http://localhost:3000'

async function testEnumEndpoint() {
  console.log('🧪 Testing Enum Endpoint...')
  console.log('📍 URL:', `${BASE_URL}/api/enums`)
  
  try {
    const startTime = Date.now()
    const response = await fetch(`${BASE_URL}/api/enums`)
    const endTime = Date.now()
    
    console.log(`⏱️  Response Time: ${endTime - startTime}ms`)
    console.log(`📊 Status: ${response.status} ${response.statusText}`)
    console.log(`📝 Headers:`, Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ SUCCESS - Enum data loaded')
      console.log(`📈 Data Keys:`, Object.keys(data.data || {}))
      console.log(`🔢 Product Types Count:`, data.data?.productTypes?.length || 0)
      console.log(`🔢 Grinds Count:`, data.data?.grinds?.length || 0)
    } else {
      const errorText = await response.text()
      console.log('❌ FAILED - Error response')
      console.log(`🚨 Error Body:`, errorText)
    }
  } catch (error) {
    console.log('💥 NETWORK ERROR')
    console.log(`🚨 Error:`, error.message)
    console.log(`🔍 Stack:`, error.stack)
  }
}

testEnumEndpoint()
