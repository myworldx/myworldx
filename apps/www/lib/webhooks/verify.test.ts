import { describe, expect, it } from 'vitest'

import { signPayload, verifySignature } from './verify'

const secret = 'a-shared-secret'
const body = JSON.stringify({ action: 'created', installation: { account: { login: 'raferdev' } } })

describe('verifySignature', () => {
  it('accepts a signature produced with the same secret', async () => {
    expect(await verifySignature(secret, body, await signPayload(secret, body))).toBe(true)
  })

  it('agrees with an independent hmac implementation', async () => {
    expect(await signPayload("It's a Secret to Everybody", 'Hello, World!')).toBe(
      'sha256=757107ea0eb2509fc211221cce984b8a37570b6d7586c22c46f4379c8b043e17'
    )
  })

  it('rejects a signature made with a different secret', async () => {
    expect(await verifySignature(secret, body, await signPayload('another-secret', body))).toBe(false)
  })

  it('rejects a signature for a different body', async () => {
    const signature = await signPayload(secret, body)
    expect(await verifySignature(secret, body + ' ', signature)).toBe(false)
  })

  it('rejects a body altered without changing its length', async () => {
    const original = '{"action":"created"}'
    const tampered = '{"action":"deleted"}'
    const signature = await signPayload(secret, original)

    expect(tampered).toHaveLength(original.length)
    expect(await verifySignature(secret, tampered, signature)).toBe(false)
  })

  it('rejects a missing or malformed header', async () => {
    expect(await verifySignature(secret, body, null)).toBe(false)
    expect(await verifySignature(secret, body, '')).toBe(false)
    expect(await verifySignature(secret, body, 'deadbeef')).toBe(false)
    expect(await verifySignature(secret, body, 'sha1=deadbeef')).toBe(false)
  })

  it('rejects a header that is not valid hex', async () => {
    expect(await verifySignature(secret, body, 'sha256=nothexatall')).toBe(false)
    expect(await verifySignature(secret, body, 'sha256=abc')).toBe(false)
    expect(await verifySignature(secret, body, 'sha256=')).toBe(false)
  })

  it('rejects a truncated signature that prefixes the real one', async () => {
    const signature = await signPayload(secret, body)
    expect(await verifySignature(secret, body, signature.slice(0, -2))).toBe(false)
  })

  it('refuses to verify when no secret is configured', async () => {
    expect(await verifySignature('', body, await signPayload(secret, body))).toBe(false)
  })

  it('accepts the signature regardless of hex case', async () => {
    const signature = await signPayload(secret, body)
    expect(await verifySignature(secret, body, signature.toUpperCase().replace('SHA256=', 'sha256='))).toBe(true)
  })
})
