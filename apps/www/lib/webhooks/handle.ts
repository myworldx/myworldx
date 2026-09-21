import { applyOperations, type RepositoryIndex } from '@/lib/repository-index/store'

import { affectedLogins, planIndexUpdate } from './events'
import { verifySignature } from './verify'

export type WebhookResult = {
  status: number
  body: { ok: boolean; reason?: string; applied?: number; revalidated?: string[] }
}

export type WebhookRequest = {
  event: string | null
  delivery: string | null
  signature: string | null
  body: string
}

export type WebhookDependencies = {
  secret: string | undefined
  index: RepositoryIndex
  revalidate?: (login: string) => void
}

export function accountTag(login: string): string {
  return `account:${login.toLowerCase()}`
}

export async function handleWebhook(
  request: WebhookRequest,
  { secret, index, revalidate }: WebhookDependencies
): Promise<WebhookResult> {
  if (!secret) {
    return { status: 500, body: { ok: false, reason: 'webhook secret is not configured' } }
  }

  if (!request.event) {
    return { status: 400, body: { ok: false, reason: 'missing x-github-event' } }
  }

  if (!(await verifySignature(secret, request.body, request.signature))) {
    return { status: 401, body: { ok: false, reason: 'signature did not match' } }
  }

  let payload: unknown
  try {
    payload = JSON.parse(request.body)
  } catch {
    return { status: 400, body: { ok: false, reason: 'body was not json' } }
  }

  if (request.event === 'ping') return { status: 200, body: { ok: true, applied: 0 } }

  const operations = planIndexUpdate(request.event, payload)
  await applyOperations(index, operations)

  const logins = affectedLogins(operations)
  for (const login of logins) revalidate?.(login)

  return { status: 200, body: { ok: true, applied: operations.length, revalidated: logins } }
}
