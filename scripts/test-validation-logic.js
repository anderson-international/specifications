// Test API validation with confirmed valid user ID
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

async function testValidation() {
  console.log('=== VALIDATION TESTING WITH VALID USER ID ===\n');
  
  const validUserId = '573a830b-39ad-4796-a39b-6b77ae589d16';
  
  // Test 1: Missing shopify_handle
  console.log('1. Testing missing shopify_handle (should return 400)...');
  const missingHandle = {
    specification: {
      // shopify_handle missing
      product_type_id: 1,
      star_rating: 3,
      user_id: validUserId
    },
    junctionData: {
      tasting_note_ids: [1]
    }
  };

  try {
    const result1 = await makeRequest('POST', '/api/specifications', missingHandle);
    console.log(`Status: ${result1.status}`);
    if (result1.status === 400) {
      console.log(`✅ VALIDATION WORKING: ${result1.data.error}`);
    } else {
      console.log(`❌ VALIDATION FAILED: Expected 400, got ${result1.status}`);
      console.log(`Response: ${JSON.stringify(result1.data, null, 2)}`);
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
  console.log('');

  // Test 2: Invalid star rating
  console.log('2. Testing invalid star rating (should return 400)...');
  const invalidRating = {
    specification: {
      shopify_handle: 'test-invalid-rating',
      product_type_id: 1,
      star_rating: 6, // Invalid: > 5
      user_id: validUserId
    },
    junctionData: {
      tasting_note_ids: [1]
    }
  };

  try {
    const result2 = await makeRequest('POST', '/api/specifications', invalidRating);
    console.log(`Status: ${result2.status}`);
    if (result2.status === 400) {
      console.log(`✅ RATING VALIDATION WORKING: ${result2.data.error}`);
    } else {
      console.log(`❌ RATING VALIDATION FAILED: Expected 400, got ${result2.status}`);
      console.log(`Response: ${JSON.stringify(result2.data, null, 2)}`);
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
  console.log('');

  // Test 3: Empty tasting notes
  console.log('3. Testing empty tasting notes (should return 400)...');
  const emptyNotes = {
    specification: {
      shopify_handle: 'test-empty-notes',
      product_type_id: 1,
      star_rating: 3,
      user_id: validUserId
    },
    junctionData: {
      tasting_note_ids: [] // Empty array
    }
  };

  try {
    const result3 = await makeRequest('POST', '/api/specifications', emptyNotes);
    console.log(`Status: ${result3.status}`);
    if (result3.status === 400) {
      console.log(`✅ TASTING NOTES VALIDATION WORKING: ${result3.data.error}`);
    } else {
      console.log(`❌ TASTING NOTES VALIDATION FAILED: Expected 400, got ${result3.status}`);
      console.log(`Response: ${JSON.stringify(result3.data, null, 2)}`);
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
  console.log('');

  // Test 4: Missing user_id
  console.log('4. Testing missing user_id (should return 400)...');
  const missingUser = {
    specification: {
      shopify_handle: 'test-missing-user',
      product_type_id: 1,
      star_rating: 3
      // user_id missing
    },
    junctionData: {
      tasting_note_ids: [1]
    }
  };

  try {
    const result4 = await makeRequest('POST', '/api/specifications', missingUser);
    console.log(`Status: ${result4.status}`);
    if (result4.status === 400) {
      console.log(`✅ USER_ID VALIDATION WORKING: ${result4.data.error}`);
    } else {
      console.log(`❌ USER_ID VALIDATION FAILED: Expected 400, got ${result4.status}`);
      console.log(`Response: ${JSON.stringify(result4.data, null, 2)}`);
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
  console.log('');

  console.log('=== VALIDATION TESTING COMPLETED ===');
}

testValidation().catch(console.error);
