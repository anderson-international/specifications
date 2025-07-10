// UI test verification script
const http = require('http');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
  const justinUserId = '573a830b-39ad-4796-a39b-6b77ae589d16';
  
  // Search for specific handle for Justin only
  console.log(`=== SEARCHING FOR HANDLE: ${searchHandle} (Justin only) ===\n`);
  
  makeRequest('GET', `/api/specifications?userId=${justinUserId}&limit=50`)
    .then(async response => {
      if (response.status === 200) {
        const specifications = response.data.data?.specifications || [];
        const found = specifications.find(spec => 
          spec.shopify_handle && spec.shopify_handle.includes(searchHandle)
        );
        
        if (found) {
          console.log('✅ FOUND SPECIFICATION (Justin):');
          console.log(`ID: ${found.id}`);
          console.log(`Shopify Handle: ${found.shopify_handle}`);
          console.log(`User: ${found.users?.name || 'Justin'}`);
          console.log(`Created: ${found.created_at}`);
          
          // Core specification fields
          console.log('\n📋 CORE SPECIFICATION:');
          
          // Decode core enum IDs to names
          const [productTypes, productBrands, grinds, experienceLevels, nicotineLevels, moistureLevels, statuses] = await Promise.all([
            prisma.enum_product_types.findUnique({ where: { id: found.product_type_id }, select: { name: true } }),
            prisma.enum_product_brands.findUnique({ where: { id: found.product_brand_id }, select: { name: true } }),
            prisma.enum_grinds.findUnique({ where: { id: found.grind_id }, select: { name: true } }),
            prisma.enum_experience_levels.findUnique({ where: { id: found.experience_level_id }, select: { name: true } }),
            prisma.enum_nicotine_levels.findUnique({ where: { id: found.nicotine_level_id }, select: { name: true } }),
            prisma.enum_moisture_levels.findUnique({ where: { id: found.moisture_level_id }, select: { name: true } }),
            prisma.enum_specification_statuses.findUnique({ where: { id: found.status_id }, select: { name: true } })
          ]);
          
          console.log(`  Product Type: ${found.product_type_id} (${productTypes?.name || 'Unknown'})`);
          console.log(`  Product Brand: ${found.product_brand_id} (${productBrands?.name || 'Unknown'})`);
          console.log(`  Grind: ${found.grind_id} (${grinds?.name || 'Unknown'})`);
          console.log(`  Experience Level: ${found.experience_level_id} (${experienceLevels?.name || 'Unknown'})`);
          console.log(`  Nicotine Level: ${found.nicotine_level_id} (${nicotineLevels?.name || 'Unknown'})`);
          console.log(`  Moisture Level: ${found.moisture_level_id} (${moistureLevels?.name || 'Unknown'})`);
          console.log(`  Status: ${found.status_id} (${statuses?.name || 'Unknown'})`);
          
          
          // Boolean characteristics
          console.log('\n🔘 CHARACTERISTICS:');
          console.log(`  Is Fermented: ${found.is_fermented}`);
          console.log(`  Is Oral Tobacco: ${found.is_oral_tobacco}`);
          console.log(`  Is Artisan: ${found.is_artisan}`);
          
          // Review and rating
          console.log('\n⭐ REVIEW & RATING:');
          console.log(`  Star Rating: ${found.star_rating}`);
          console.log(`  Rating Boost: ${found.rating_boost}`);
          console.log(`  Review: ${found.review}`);
          
          // Junction table data
          console.log('\n🔗 JUNCTION TABLES:');
          if (found.spec_tasting_notes && found.spec_tasting_notes.length > 0) {
            console.log(`  Tasting Notes: ${found.spec_tasting_notes.map(tn => `${tn.enum_tasting_note_id} (${tn.enum_tasting_notes?.name || 'Unknown'})`).join(', ')}`);
          } else {
            console.log('  Tasting Notes: None');
          }
          
          if (found.spec_cures && found.spec_cures.length > 0) {
            console.log(`  Cures: ${found.spec_cures.map(c => `${c.enum_cure_id} (${c.enum_cures?.name || 'Unknown'})`).join(', ')}`);
          } else {
            console.log('  Cures: None');
          }
          
          if (found.spec_tobacco_types && found.spec_tobacco_types.length > 0) {
            console.log(`  Tobacco Types: ${found.spec_tobacco_types.map(tt => `${tt.enum_tobacco_type_id} (${tt.enum_tobacco_types?.name || 'Unknown'})`).join(', ')}`);
          } else {
            console.log('  Tobacco Types: None');
          }
          
          console.log(`\n🗑️  TO DELETE: specification ID ${found.id}`);
        } else {
          console.log('❌ SPECIFICATION NOT FOUND');
          console.log(`No specification found for Justin with handle containing: ${searchHandle}`);
        }
      } else {
        console.log(`❌ Error: ${response.status}`);
      }
    })
    .catch(e => console.log(`❌ Error: ${e.message}`));
    
} else {
  verifyUITest().catch(console.error);
}
