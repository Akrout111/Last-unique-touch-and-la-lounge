import { describe, it, expect } from 'vitest'
import { GET } from '@/app/api/v1/health/route'

describe('Health endpoint', () => {
  it('returns ok status', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('ok')
    expect(data.timestamp).toBeDefined()
  })

  it('returns valid ISO timestamp', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
    )
  })
})
