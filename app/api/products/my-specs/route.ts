import { makeUserProductsGetHandler } from '@/lib/api/products/products-route-utils'

export const GET = makeUserProductsGetHandler('my-specs', true)
