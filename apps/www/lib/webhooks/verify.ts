const PREFIX = 'sha256='

const encoder = new TextEncoder()

function decodeHex(value: string): Uint8Array | null {
  if (value.length === 0 || value.length % 2 !== 0) return null
  if (!/^[\da-f]+$/i.test(value)) return null

  const bytes = new Uint8Array(value.length / 2)
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16)
  }

  return bytes
}

function equalInConstantTime(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false

  let difference = 0
  for (let index = 0; index < a.length; index += 1) {
    difference |= (a[index] ?? 0) ^ (b[index] ?? 0)
  }

  return difference === 0
}

export async function signPayload(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ])

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  const hex = [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('')

  return PREFIX + hex
}

export async function verifySignature(secret: string, body: string, header: string | null): Promise<boolean> {
  if (!secret || !header) return false
  if (!header.startsWith(PREFIX)) return false

  const received = decodeHex(header.slice(PREFIX.length))
  if (!received) return false

  const expected = decodeHex((await signPayload(secret, body)).slice(PREFIX.length))
  if (!expected) return false

  return equalInConstantTime(received, expected)
}
