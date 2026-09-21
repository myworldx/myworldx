import { headers } from 'next/headers'

import { loadAccount, type Account } from '@/lib/accounts'
import { getContentTree, getDoc, getVisibleDepth, type Content } from '@/lib/content'
import { getValidSubdomain } from '@/lib/subdomain'

const defaultContent: Content = { getContentTree, getVisibleDepth, getDoc, getAllDocSlugs: async () => [] }

export type Tenant = {
  account: Account | null
  content: Content
}

export async function resolveTenant(): Promise<Tenant> {
  const host = (await headers()).get('host')
  const login = getValidSubdomain(host, process.env.ROOT_DOMAIN)

  if (!login) return { account: null, content: defaultContent }

  const account = await loadAccount(login)
  if (!account) return { account: null, content: defaultContent }

  return { account, content: account.content }
}
