import { EmitterWebhookEventName } from '@octokit/webhooks/dist-types/types'
import { NextApiRequest } from 'next'
import { IncomingHttpHeaders } from 'http'

interface GithubApiHeader extends IncomingHttpHeaders {
  'x-github-delivery': string
  'x-hub-signature': string
  'x-hub-signature-256': string
  'x-github-event': EmitterWebhookEventName
}

export interface GithubApiRequest extends NextApiRequest {
  headers: GithubApiHeader
}

export interface InstallationEvent {
  action: 'created'
  installation: Installation
  repositories?: {
    id: number
    node_id: string
    name: string
    full_name: string
    private: boolean
  }[]
  sender: User
}

export interface Installation {
  id: number
  account: User
  repository_selection: 'all' | 'selected'
  access_tokens_url: string
  repositories_url: string
  html_url: string
  app_id: number
  app_slug?: string
  target_id: number
  target_type: 'User' | 'Organization'
  permissions: {
    actions?: 'read' | 'write'
    administration?: 'read' | 'write'
    checks?: 'read' | 'write'
    contents?: 'read' | 'write'
    deployments?: 'read' | 'write'
    issues?: 'read' | 'write'
    organization_administration?: 'read' | 'write'
    pages?: 'read' | 'write'
    pull_requests?: 'read' | 'write'
    repository_hooks?: 'read' | 'write'
    repository_projects?: 'read' | 'write'
    statuses?: 'read' | 'write'
    metadata?: 'read' | 'write'
    vulnerability_alerts?: 'read' | 'write'
  }

  events: string[]
  created_at: string | number
  updated_at: string | number
  single_file_name: string | null
  has_multiple_single_files?: boolean
  single_file_paths?: string[]
  suspended_at?: string | null
}

export interface User {
  login: string
  id: number
  node_id: string
  name?: string
  email?: string | null
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: 'Bot' | 'User' | 'Organization'
  site_admin: boolean
}
