import { describe, expect, it } from 'vitest'

import { createMemoryRepositoryIndex } from '@/lib/repository-index'

import { handleWebhook } from './handle'
import { signPayload } from './verify'

const secret = 'a-shared-secret'

async function deliver(event: string, payload: unknown, options: { secret?: string; signature?: string } = {}) {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload)
  const index = createMemoryRepositoryIndex()

  const result = await handleWebhook(
    {
      event,
      delivery: 'delivery-1',
      signature: options.signature ?? (await signPayload(options.secret ?? secret, body)),
      body,
    },
    { secret, index }
  )

  return { result, index }
}

const created = {
  action: 'created',
  installation: { account: { login: 'raferdev' } },
  repositories: [{ name: 'notes.blog' }, { name: 'dotfiles' }],
}

describe('handleWebhook', () => {
  it('applies the planned operations and reports how many ran', async () => {
    const { result, index } = await deliver('installation', created)

    expect(result.status).toBe(200)
    expect(result.body).toEqual({ ok: true, applied: 1, revalidated: ['raferdev'] })
    expect(await index.listRepositories('raferdev')).toEqual(['dotfiles', 'notes.blog'])
  })

  it('answers a ping without touching the index', async () => {
    const { result, index } = await deliver('ping', { zen: 'Keep it logically awesome.' })

    expect(result.status).toBe(200)
    expect(await index.listRepositories('raferdev')).toBeNull()
  })

  it('rejects a signature that does not match, and changes nothing', async () => {
    const { result, index } = await deliver('installation', created, { secret: 'the-wrong-secret' })

    expect(result.status).toBe(401)
    expect(result.body.reason).toBe('signature did not match')
    expect(await index.listRepositories('raferdev')).toBeNull()
  })

  it('rejects a delivery with no signature at all', async () => {
    const { result } = await deliver('installation', created, { signature: '' })
    expect(result.status).toBe(401)
  })

  it('rejects a delivery with no event header', async () => {
    const body = JSON.stringify(created)
    const result = await handleWebhook(
      { event: null, delivery: 'd', signature: await signPayload(secret, body), body },
      { secret, index: createMemoryRepositoryIndex() }
    )

    expect(result.status).toBe(400)
    expect(result.body.reason).toBe('missing x-github-event')
  })

  it('rejects a correctly signed body that is not json', async () => {
    const { result } = await deliver('installation', 'not json at all')

    expect(result.status).toBe(400)
    expect(result.body.reason).toBe('body was not json')
  })

  it('fails loudly when no secret is configured rather than accepting anything', async () => {
    const body = JSON.stringify(created)
    const result = await handleWebhook(
      { event: 'installation', delivery: 'd', signature: await signPayload(secret, body), body },
      { secret: undefined, index: createMemoryRepositoryIndex() }
    )

    expect(result.status).toBe(500)
    expect(result.body.ok).toBe(false)
  })

  it('accepts an event it has no plan for without applying anything', async () => {
    const { result } = await deliver('push', { installation: { account: { login: 'raferdev' } } })

    expect(result.status).toBe(200)
    expect(result.body).toEqual({ ok: true, applied: 0, revalidated: [] })
  })
})

describe('handleWebhook revalidation', () => {
  it('revalidates each account an event touched, once per account', async () => {
    const revalidated: string[] = []
    const body = JSON.stringify({
      action: 'renamed',
      repository: { name: 'notes.blog', owner: { login: 'RaferDev' } },
      installation: { account: { login: 'RaferDev' } },
      changes: { repository: { name: { from: 'scratch.blog' } } },
    })

    const result = await handleWebhook(
      { event: 'repository', delivery: 'd', signature: await signPayload(secret, body), body },
      {
        secret,
        index: createMemoryRepositoryIndex(),
        revalidate: (login) => revalidated.push(login),
      }
    )

    expect(result.body.revalidated).toEqual(['raferdev'])
    expect(revalidated).toEqual(['raferdev'])
  })

  it('revalidates nothing when an event plans no change', async () => {
    const revalidated: string[] = []
    const body = JSON.stringify({ zen: 'Keep it logically awesome.' })

    await handleWebhook(
      { event: 'ping', delivery: 'd', signature: await signPayload(secret, body), body },
      { secret, index: createMemoryRepositoryIndex(), revalidate: (login) => revalidated.push(login) }
    )

    expect(revalidated).toEqual([])
  })

  it('does not revalidate when a signature fails', async () => {
    const revalidated: string[] = []
    const body = JSON.stringify(created)

    await handleWebhook(
      { event: 'installation', delivery: 'd', signature: await signPayload('wrong', body), body },
      { secret, index: createMemoryRepositoryIndex(), revalidate: (login) => revalidated.push(login) }
    )

    expect(revalidated).toEqual([])
  })
})
