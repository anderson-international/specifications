/**
 * Test API route for Shopify GraphQL product fetcher
 * GET /api/test/shopify
 */

import { NextRequest, NextResponse } from 'next/server';
import { getShopifyProductService } from '@/lib/shopify';

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🧪 Testing Shopify GraphQL Product Fetcher...');
    
    const productService = getShopifyProductService();
    
    console.log('📡 Fetching first 10 products from Shopify...');
    
    // Test fetching a small batch first
    const products = await productService.fetchAllProducts(10);
    
    console.log(`✅ Successfully fetched ${products.length} products`);
    
    const result = {
      success: true,
      message: `Successfully fetched ${products.length} products from Shopify`,
      productCount: products.length,
      sampleProduct: products.length > 0 ? products[0] : null,
      allProducts: products.map(p => ({
        handle: p.handle,
        title: p.title,
        brand: p.brand,
        hasImage: !!p.image_url,
        spec_count_total: p.spec_count_total
      }))
    };

    // Test single product fetch if we have products
    if (products.length > 0) {
      const firstHandle = products[0].handle;
      console.log(`🔍 Testing single product fetch for handle: ${firstHandle}`);
      
      const singleProduct = await productService.fetchProductByHandle(firstHandle);
      
      result.singleProductTest = {
        handle: firstHandle,
        success: !!singleProduct,
        product: singleProduct
      };
    }
    
    console.log('🎉 Shopify fetcher test completed successfully!');
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Shopify fetcher test failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
