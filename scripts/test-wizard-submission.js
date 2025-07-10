// Final wizard submission test script with proper UUID
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

async function runFinalTests() {
  console.log('=== FINAL WIZARD SUBMISSION TESTS ===\n');
  
  // Test 1: Valid submission with proper UUID (from database)
  console.log('1. Testing valid submission with proper UUID...');
  const validPayload = {
    specification: {
      shopify_handle: 'test-final-api-submission-wizard',
      product_type_id: 1,
      is_fermented: false,
      is_oral_tobacco: false,
      is_artisan: true,
      grind_id: 1,
      nicotine_level_id: 1,
      experience_level_id: 1,
      review: 'Final API test submission for wizard validation - this review text meets the minimum character requirements for the review field and contains sufficient detail.',
      star_rating: 5,
      rating_boost: 0,
      user_id: 'fc31f3b3-0fdd-49a1-ae80-5cd175fa177e', // Real UUID from database (Simon Hawes)
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
    const validResult = await makeRequest('POST', '/api/specifications', validPayload);
    console.log(`Status: ${validResult.status}`);
    if (validResult.status === 200 || validResult.status === 201) {
      console.log(`✅ SUCCESS! Created specification ID: ${validResult.data.id}`);
      console.log(`📋 Shopify Handle: ${validResult.data.shopify_handle}`);
      console.log(`⭐ Star Rating: ${validResult.data.star_rating}`);
      console.log(`👤 User: ${validResult.data.users.name}`);
      console.log(`🏷️  Brand: ${validResult.data.enum_product_brands.name}`);
      console.log(`📊 Status: ${validResult.data.enum_specification_statuses.name}`);
      console.log(`\n🗑️  TO DELETE: specification ID ${validResult.data.id}`);
      console.log(`SQL: DELETE FROM specifications WHERE id = ${validResult.data.id};`);
    } else {
      console.log(`❌ FAILED: ${JSON.stringify(validResult.data, null, 2)}`);
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e.message}`);
  }
  console.log('');

  // Test 2: Validation check - missing required field
  console.log('2. Testing validation - missing shopify_handle...');
  const missingHandlePayload = {
    specification: {
      product_type_id: 1,
      star_rating: 3,
      user_id: 'fc31f3b3-0fdd-49a1-ae80-5cd175fa177e'
    },
    junctionData: {
      tasting_note_ids: [1]
    }
  };

  try {
    const missingResult = await makeRequest('POST', '/api/specifications', missingHandlePayload);
    console.log(`Status: ${missingResult.status}`);
    if (missingResult.status === 400) {
      console.log(`✅ Validation working: ${JSON.stringify(missingResult.data, null, 2)}`);
    } else if (missingResult.status === 200) {
      console.log(`❌ Validation bypassed - returned 200 instead of 400`);
      console.log(`Response: ${JSON.stringify(missingResult.data, null, 2)}`);
    } else {
      console.log(`❓ Unexpected status: ${JSON.stringify(missingResult.data, null, 2)}`);
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
  console.log('');

  // Test 3: Validation check - invalid star rating
  console.log('3. Testing validation - invalid star rating (6)...');
  const invalidRatingPayload = {
    specification: {
      shopify_handle: 'test-invalid-rating-check',
      product_type_id: 1,
      star_rating: 6, // Invalid: must be 1-5
      user_id: 'fc31f3b3-0fdd-49a1-ae80-5cd175fa177e'
    },
    junctionData: {
      tasting_note_ids: [1]
    }
  };

  try {
    const ratingResult = await makeRequest('POST', '/api/specifications', invalidRatingPayload);
    console.log(`Status: ${ratingResult.status}`);
    if (ratingResult.status === 400) {
      console.log(`✅ Rating validation working: ${JSON.stringify(ratingResult.data, null, 2)}`);
    } else if (ratingResult.status === 200) {
      console.log(`❌ Rating validation bypassed - returned 200 instead of 400`);
      console.log(`Response: ${JSON.stringify(ratingResult.data, null, 2)}`);
    } else {
      console.log(`❓ Unexpected status: ${JSON.stringify(ratingResult.data, null, 2)}`);
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
  console.log('');

  // Test 4: Validation check - empty tasting notes
  console.log('4. Testing validation - empty tasting notes...');
  const emptyNotesPayload = {
    specification: {
      shopify_handle: 'test-empty-tasting-notes',
      product_type_id: 1,
      star_rating: 3,
      user_id: 'fc31f3b3-0fdd-49a1-ae80-5cd175fa177e'
    },
    junctionData: {
      tasting_note_ids: [] // Empty - should be invalid
    }
  };

  try {
    const emptyResult = await makeRequest('POST', '/api/specifications', emptyNotesPayload);
    console.log(`Status: ${emptyResult.status}`);
    if (emptyResult.status === 400) {
      console.log(`✅ Tasting notes validation working: ${JSON.stringify(emptyResult.data, null, 2)}`);
    } else if (emptyResult.status === 200) {
      console.log(`❌ Tasting notes validation bypassed - returned 200 instead of 400`);
      console.log(`Response: ${JSON.stringify(emptyResult.data, null, 2)}`);
    } else {
      console.log(`❓ Unexpected status: ${JSON.stringify(emptyResult.data, null, 2)}`);
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
  console.log('');

  console.log('=== FINAL TESTS COMPLETED ===');
  console.log('Summary:');
  console.log('- Database persistence test: Check if valid submission created record');
  console.log('- Validation tests: Check if API properly rejects invalid data');
  console.log('- Any test records created should be deleted using the SQL provided above');
}

runFinalTests().catch(console.error);
