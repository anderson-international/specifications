// Test script with confirmed valid user ID
const http = require('http');

async function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runValidUserTest() {
  console.log('=== TEST WITH CONFIRMED VALID USER ID ===\n');
  
  // Test with confirmed valid user ID: 573a830b-39ad-4796-a39b-6b77ae589d16
  console.log('Testing valid submission with confirmed user ID...');
  const validPayload = {
    specification: {
      shopify_handle: 'test-confirmed-user-submission',
      product_type_id: 1,
      is_fermented: false,
      is_oral_tobacco: false,
      is_artisan: true,
      grind_id: 1,
      nicotine_level_id: 1,
      experience_level_id: 1,
      review: 'Test submission with confirmed valid user ID - this review meets character requirements and should successfully create a specification record in the database.',
      star_rating: 4,
      rating_boost: 0,
      user_id: '573a830b-39ad-4796-a39b-6b77ae589d16', // Confirmed valid user ID
      moisture_level_id: 1,
      product_brand_id: 1,
      status_id: 1
    },
    junctionData: {
      tasting_note_ids: [1, 2, 3],
      cure_ids: [1, 2],
      tobacco_type_ids: [1, 2, 3]
    }
  };

  try {
    const result = await makeRequest('POST', '/api/specifications', validPayload);
    console.log(`Status: ${result.status}`);
    
    if (result.status === 200 || result.status === 201) {
      console.log(`✅ SUCCESS! Response received`);
      console.log(`Response structure:`, Object.keys(result.data));
      
      if (result.data.id) {
        console.log(`📋 Created specification ID: ${result.data.id}`);
        console.log(`🏷️  Shopify Handle: ${result.data.shopify_handle}`);
        console.log(`⭐ Star Rating: ${result.data.star_rating}`);
        console.log(`👤 User: ${result.data.users?.name || 'Unknown'}`);
        console.log(`\n🗑️  TO DELETE: specification ID ${result.data.id}`);
        console.log(`SQL: DELETE FROM specifications WHERE id = ${result.data.id};`);
      } else {
        console.log(`❌ No ID returned - possible API response issue`);
        console.log(`Full response:`, JSON.stringify(result.data, null, 2));
      }
    } else if (result.status === 500) {
      console.log(`❌ SERVER ERROR: ${result.data.error}`);
    } else {
      console.log(`❌ UNEXPECTED STATUS: ${result.status}`);
      console.log(`Response:`, JSON.stringify(result.data, null, 2));
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e.message}`);
  }
  
  console.log('\n=== TEST WITH CONFIRMED USER COMPLETED ===');
}

runValidUserTest().catch(console.error);
