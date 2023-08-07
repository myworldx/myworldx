import { type Prisma } from '../../../node_modules/@prisma-postgres/client'

export type CreateInstallationData = Prisma.InstallationCreateArgs['data']

type User = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  following_url: string
  followers_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export interface CreateInstallationWebhook {
  event_id: string
  event_name: string
  id: number
  account: User
  sender: User
  created_at: string
  updated_at: string
}
