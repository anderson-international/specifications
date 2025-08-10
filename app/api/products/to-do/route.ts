import { makeUserProductsGetHandler } from '@/lib/api/products/products-route-utils'

export const GET = makeUserProductsGetHandler('to-do', false)
