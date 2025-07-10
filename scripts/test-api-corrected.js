// Corrected test script with valid user ID
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

async function runCorrectedTests() {
  console.log('=== CORRECTED WIZARD SUBMISSION API TESTS ===\n');
  
  // Test 1: Get correct baseline count with proper query
  console.log('1. Getting correct specification count...');
  try {
    const baseline = await makeRequest('GET', '/api/specifications');
    console.log(`Status: ${baseline.status}`);
    if (baseline.data.specifications) {
      console.log(`Current count: ${baseline.data.specifications.length}`);
      console.log(`Total from pagination: ${baseline.data.pagination?.total || 'N/A'}`);
    } else {
      console.log(`Response: ${JSON.stringify(baseline.data, null, 2)}`);
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
  console.log('');

  // Test 2: Valid submission with real user ID (using first user ID visible in screenshot)
  console.log('2. Testing valid submission with real user ID...');
  const validPayload = {
    specification: {
      shopify_handle: 'test-api-valid-submission-12345',
      product_type_id: 1,
      is_fermented: false,
      is_oral_tobacco: false,
      is_artisan: true,
      grind_id: 1,
      nicotine_level_id: 1,
      experience_level_id: 1,
      review: 'Corrected API test submission - this is a test specification review with sufficient character length to meet minimum requirements for the review field.',
      star_rating: 4,
      rating_boost: 0,
      user_id: '60fc1b1-4f4f-4cb0-b18a-14a17136eac71', // Real user ID from screenshot
      moisture_level_id: 1,
      product_brand_id: 1,
      status_id: 1
    },
    junctionData: {
      tasting_note_ids: [1, 2],
      cure_ids: [1],
      tobacco_type_ids: [1, 2]
    }
  };

  try {
    const validResult = await makeRequest('POST', '/api/specifications', validPayload);
    console.log(`Status: ${validResult.status}`);
    if (validResult.status === 200 || validResult.status === 201) {
      console.log(`✅ Success! Created specification ID: ${validResult.data.id}`);
      console.log(`⚠️  RECORD TO DELETE: specifications.id = ${validResult.data.id}`);
      console.log(`Created specification: ${validResult.data.shopify_handle}`);
    } else {
      console.log(`❌ Error response: ${JSON.stringify(validResult.data, null, 2)}`);
    }
  } catch (e) {
    console.log(`❌ Error: ${e.message}`);
  }
  console.log('');

  // Test 3: Verify validation still works
  console.log('3. Testing validation - missing shopify_handle...');
  const invalidPayload = {
    specification: {
      product_type_id: 1,
      star_rating: 3,
      user_id: '60fc1b1-4f4f-4cb0-b18a-14a17136eac71'
    },
    junctionData: {
      tasting_note_ids: [1]
    }
  };

  try {
    const invalidResult = await makeRequest('POST', '/api/specifications', invalidPayload);
    console.log(`Status: ${invalidResult.status}`);
    if (invalidResult.status === 400) {
      console.log(`✅ Validation working: ${JSON.stringify(invalidResult.data, null, 2)}`);
    } else {
      console.log(`❌ Validation broken: ${JSON.stringify(invalidResult.data, null, 2)}`);
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
  console.log('');

  console.log('=== CORRECTED TESTS COMPLETED ===');
}

runCorrectedTests().catch(console.error);
