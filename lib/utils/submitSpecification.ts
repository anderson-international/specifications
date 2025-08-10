export interface ApiRequest {
  url: string
  method: string
  body?: unknown
}
export async function submitSpecification<T = unknown>(req: ApiRequest): Promise<T> {
  const response = await fetch(req.url, {
    method: req.method,
    headers: { 'Content-Type': 'application/json' },
    body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
  })

  if (!response.ok) {
    let details = 'server returned an error without message'
    try {
      const trimmed = (await response.text()).trim()
      if (trimmed.length > 0) {
        try {
          const parsed = JSON.parse(trimmed) as { message?: unknown }
          details =
            typeof parsed.message === 'string' && parsed.message.trim().length > 0
              ? parsed.message.trim()
              : trimmed
        } catch {
          details = trimmed
        }
      }
    } catch {
      details = 'failed to read error response'
    }
    throw new Error(`Request failed (HTTP ${response.status} ${response.statusText}): ${details}`)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new Error('Request succeeded but response could not be parsed as JSON')
  }
}
