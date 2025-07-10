// UI test verification script
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

async function verifyUITest() {
  console.log('=== UI TEST VERIFICATION ===\n');
  
  const justinUserId = '573a830b-39ad-4796-a39b-6b77ae589d16';
  
  console.log('1. Getting Justin\'s current specifications...');
  try {
    const response = await makeRequest('GET', `/api/specifications?userId=${justinUserId}`);
    
    if (response.status === 200) {
      const specifications = response.data.data?.specifications || [];
      const totalCount = response.data.data?.pagination?.total || specifications.length;
      
      console.log(`✅ Found ${totalCount} total specifications for Justin (showing first ${specifications.length})`);
      
      // Show most recent specifications
      const recent = specifications.slice(0, 3);
      console.log('\nMost recent specifications:');
      recent.forEach((spec, index) => {
        console.log(`  ${index + 1}. ID: ${spec.id}, Handle: ${spec.shopify_handle}, Created: ${spec.created_at}`);
      });
      
      // Look for test handles
      const testSpecs = specifications.filter(spec => 
        spec.shopify_handle && spec.shopify_handle.toLowerCase().includes('test')
      );
      
      if (testSpecs.length > 0) {
        console.log('\n🔍 Found test specifications:');
        testSpecs.forEach(spec => {
          console.log(`  - ID: ${spec.id}, Handle: ${spec.shopify_handle}`);
        });
      }
      
    } else {
      console.log(`❌ Error getting specifications: ${response.status}`);
      console.log(response.data);
    }
  } catch (e) {
    console.log(`❌ Error: ${e.message}`);
  }
  
  console.log('\n=== VERIFICATION COMPLETE ===');
  console.log('Instructions for UI testing:');
  console.log('1. Note the current specification count above');
  console.log('2. Use a unique shopify_handle like "ui-test-wizard-2025"');
  console.log('3. Complete the wizard and submit');
  console.log('4. Run this script again to verify the new record was created');
  console.log('5. Check that all form data was saved correctly');
}

// Check if command line argument provided
const args = process.argv.slice(2);
if (args.length > 0) {
  const searchHandle = args[0];
  
  // Search for specific handle
  console.log(`=== SEARCHING FOR HANDLE: ${searchHandle} ===\n`);
  
  makeRequest('GET', '/api/specifications?limit=50')
    .then(response => {
      if (response.status === 200) {
        const specifications = response.data.data?.specifications || [];
        const found = specifications.find(spec => 
          spec.shopify_handle && spec.shopify_handle.includes(searchHandle)
        );
        
        if (found) {
          console.log('✅ FOUND SPECIFICATION:');
          console.log(`ID: ${found.id}`);
          console.log(`Shopify Handle: ${found.shopify_handle}`);
          console.log(`Star Rating: ${found.star_rating}`);
          console.log(`Review: ${found.review}`);
          console.log(`User: ${found.users?.name || 'Unknown'}`);
          console.log(`Created: ${found.created_at}`);
          console.log(`\n🗑️  TO DELETE: specification ID ${found.id}`);
        } else {
          console.log('❌ SPECIFICATION NOT FOUND');
          console.log(`No specification found with handle containing: ${searchHandle}`);
        }
      } else {
        console.log(`❌ Error: ${response.status}`);
      }
    })
    .catch(e => console.log(`❌ Error: ${e.message}`));
    
} else {
  verifyUITest().catch(console.error);
}
