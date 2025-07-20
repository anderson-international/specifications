export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClaudeRequest {
  model: string
  max_tokens: number
  temperature: number
  system?: string
  messages: ClaudeMessage[]
}

export interface ClaudeResponse {
  content: Array<{
    type: 'text'
    text: string
  }>
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

export interface ClaudeError {
  type: string
  message: string
}

export interface ClaudeConfig {
  model: string
  maxTokens: number
  temperature: number
  maxRetries: number
  baseDelay: number
}
