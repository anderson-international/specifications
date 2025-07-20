import { type ClaudeRequest, type ClaudeResponse, type ClaudeError } from '@/lib/types/claude-types'
import { RetryUtils } from '@/lib/utils/retry-utils'

export class ClaudeAPIService {
  private static readonly BASE_URL = 'https://api.anthropic.com/v1'
  private static readonly DEFAULT_MODEL = 'claude-3-5-sonnet-20241022'
  private static readonly MAX_RETRIES = 3
  private static readonly RETRY_DELAY_BASE = 1000

  private static getApiKey(): string {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable not set')
    }
    return apiKey
  }

  static async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    temperature = 0.3,
    maxTokens = 2048
  ): Promise<string> {
    const request: ClaudeRequest = {
      model: this.DEFAULT_MODEL,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    }

    let lastError: ClaudeError | null = null

    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(`${this.BASE_URL}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.getApiKey(),
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify(request)
        })

        if (!response.ok) {
          const errorData = await response.json()
          const claudeError: ClaudeError = {
            type: errorData.error?.type || 'api_error',
            message: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
          }

          if (RetryUtils.shouldRetryClaudeError(claudeError, attempt, this.MAX_RETRIES)) {
            lastError = claudeError
            await RetryUtils.delay(RetryUtils.getRetryDelay(attempt, this.RETRY_DELAY_BASE))
            continue
          }

          throw new Error(`Claude API Error: ${claudeError.message}`)
        }

        const data: ClaudeResponse = await response.json()
        
        if (!data.content || data.content.length === 0) {
          throw new Error('Claude API returned empty response')
        }

        return data.content[0].text
      } catch (error) {
        if (error instanceof Error && !error.message.includes('Claude API Error')) {
          const networkError: ClaudeError = {
            type: 'network_error',
            message: error.message
          }

          if (RetryUtils.shouldRetryNetworkError(attempt, this.MAX_RETRIES)) {
            lastError = networkError
            await RetryUtils.delay(RetryUtils.getRetryDelay(attempt, this.RETRY_DELAY_BASE))
            continue
          }
        }

        throw error
      }
    }

    throw new Error(`Claude API failed after ${this.MAX_RETRIES} retries. Last error: ${lastError?.message}`)
  }
}
