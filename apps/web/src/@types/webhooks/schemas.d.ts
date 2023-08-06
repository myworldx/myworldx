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

export interface Repository {
  id: Number
  node_id: String
  name: String
  full_name: String
  private: Boolean
}

export type RepositoriesList = Repository[]
