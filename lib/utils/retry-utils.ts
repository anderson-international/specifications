import { type ClaudeError } from '@/lib/types/claude-types'

export class RetryUtils {
  static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static getRetryDelay(attempt: number, baseDelay: number): number {
    const jitter = Math.random() * 0.1
    return baseDelay * Math.pow(2, attempt) * (1 + jitter)
  }

  static shouldRetryClaudeError(error: ClaudeError, attempt: number, maxRetries: number): boolean {
    if (attempt >= maxRetries) return false
    
    return error.type === 'rate_limit_error' || 
           error.type === 'api_error' || 
           error.type === 'overloaded_error'
  }

  static shouldRetryNetworkError(attempt: number, maxRetries: number): boolean {
    return attempt < maxRetries
  }
}
