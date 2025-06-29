/**
 * Test script for Shopify GraphQL product fetcher
 * Run with: node scripts/test-shopify-fetcher.js
 */

require('dotenv').config();

async function testShopifyFetcher() {
  try {
    console.log('🧪 Testing Shopify GraphQL Product Fetcher...\n');
    
    // Import the Shopify service
    const { getShopifyProductService } = require('../lib/shopify/products.ts');
    const productService = getShopifyProductService();
    
    console.log('📡 Fetching first 10 products from Shopify...');
    
    // Test fetching a small batch first
    const products = await productService.fetchAllProducts(10);
    
    console.log(`✅ Successfully fetched ${products.length} products\n`);
    
    if (products.length > 0) {
      console.log('📋 Sample product structure:');
      console.log(JSON.stringify(products[0], null, 2));
      
      console.log('\n📊 Product summary:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title} (${product.handle}) - Brand: ${product.brand}`);
        if (product.image_url) {
          console.log(`   Image: ${product.image_url}`);
        }
      });
      
      // Test single product fetch
      const firstHandle = products[0].handle;
      console.log(`\n🔍 Testing single product fetch for handle: ${firstHandle}`);
      const singleProduct = await productService.fetchProductByHandle(firstHandle);
      
      if (singleProduct) {
        console.log(`✅ Single product fetch successful: ${singleProduct.title}`);
      } else {
        console.log('❌ Single product fetch returned null');
      }
    }
    
    console.log('\n🎉 Shopify fetcher test completed successfully!');
    
  } catch (error) {
    console.error('❌ Shopify fetcher test failed:', error);
    process.exit(1);
  }
}

testShopifyFetcher();
