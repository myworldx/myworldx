import app from '@/lib/octokit'

import { GithubApiRequest } from '@/@types/webhooks/schemas'
import { RepositoriesValidator } from '../repositories/validation'
import { __ValidRepositoriesList } from '@/@types/config/rules'

app.webhooks.on('installation.created', async ({ id, name, payload }) => {
  let siteContent = [] as __ValidRepositoriesList

  const account = {
    login: payload.installation.account.login,
    id: payload.installation.account.id,
    node_id: payload.installation.account.node_id,
    avatar_url: payload.installation.account.avatar_url,
    gravatar_id: payload.installation.account.gravatar_id,
    url: payload.installation.account.url,
    html_url: payload.installation.account.html_url,
    following_url: payload.installation.account.following_url,
    followers_url: payload.installation.account.followers_url,
    gists_url: payload.installation.account.gists_url,
    starred_url: payload.installation.account.starred_url,
    subscriptions_url: payload.installation.account.subscriptions_url,
    organizations_url: payload.installation.account.organizations_url,
    repos_url: payload.installation.account.repos_url,
    events_url: payload.installation.account.events_url,
    received_events_url: payload.installation.account.received_events_url,
    type: payload.installation.account.type,
    site_admin: payload.installation.account.site_admin,
  }

  const sender = {
    login: payload.sender.login,
    id: payload.sender.id,
    node_id: payload.sender.node_id,
    avatar_url: payload.sender.avatar_url,
    gravatar_id: payload.sender.gravatar_id,
    url: payload.sender.url,
    html_url: payload.sender.html_url,
    following_url: payload.sender.following_url,
    followers_url: payload.sender.followers_url,
    gists_url: payload.sender.gists_url,
    starred_url: payload.sender.starred_url,
    subscriptions_url: payload.sender.subscriptions_url,
    organizations_url: payload.sender.organizations_url,
    repos_url: payload.sender.repos_url,
    events_url: payload.sender.events_url,
    received_events_url: payload.sender.received_events_url,
    type: payload.sender.type,
    site_admin: payload.sender.site_admin,
  }

  const installation = {
    event_id: id,
    event_name: name,
    id: payload.installation.id,
    account,
    sender,
    created_at: payload.installation.created_at,
    updated_at: payload.installation.updated_at,
  }

  if (payload.repositories) {
    siteContent.push(...RepositoriesValidator({ repositories: payload.repositories }))
  }
})

async function Installation(request: GithubApiRequest) {
  const payload = await app.webhooks.verifyAndReceive({
    id: request.headers['x-github-delivery'],
    name: request.headers['x-github-event'],
    signature: request.headers['x-hub-signature-256'],
    payload: request.body,
  })
}