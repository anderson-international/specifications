// Upstash Redis singleton client for Next.js
import { Redis } from '@upstash/redis'

// Create singleton Redis client instance
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export default redis

// Export for testing/debugging if needed
export { redis }
