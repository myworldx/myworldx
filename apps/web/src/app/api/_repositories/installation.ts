import { CreateInstallationWebhook } from '@/@types/db/schema'
import { supabase } from '@/lib/supabase'

export async function RepositoryCreateInstallation({
  installation,
  pages,
}: {
  installation: CreateInstallationWebhook
  pages: any
}) {
  const InstallationData: any = {
    event_id: installation.event_id,
    event_name: installation.event_name,
    id: installation.id,
    db_name: 'raferdev',
    account: 1,

    /*   account: {
      login: installation.account.login,
      id: installation.account.id,
      node_id: installation.account.node_id,
      avatar_url: installation.account.avatar_url,
      gravatar_id: installation.account.gravatar_id,
      url: installation.account.url,
      html_url: installation.account.html_url,
      following_url: installation.account.following_url,
      followers_url: installation.account.followers_url,
      gists_url: installation.account.gists_url,
      starred_url: installation.account.starred_url,
      subscriptions_url: installation.account.subscriptions_url,
      organizations_url: installation.account.organizations_url,
      repos_url: installation.account.repos_url,
      events_url: installation.account.events_url,
      received_events_url: installation.account.received_events_url,
      type: installation.account.type,
      site_admin: installation.account.site_admin,
      page: {
        data: pages.map((page: any) => {
          return {
            db_display_name: page.name,

            id: page.id,
            node_id: pages.node_id,
            name: pages.name,
            full_name: pages.full_name,
            private: pages.private,

            db_blob_name: pages.db_blob_name,
            db_blob_url: pages.db_blob_url,
          }
        }),
      },
    }, */

    /*     sender: {
      login: installation.sender.login,
      id: installation.sender.id,
      node_id: installation.sender.node_id,
      avatar_url: installation.sender.avatar_url,
      gravatar_id: installation.sender.gravatar_id,
      url: installation.sender.url,
      html_url: installation.sender.html_url,
      following_url: installation.sender.following_url,
      followers_url: installation.sender.followers_url,
      gists_url: installation.sender.gists_url,
      starred_url: installation.sender.starred_url,
      subscriptions_url: installation.sender.subscriptions_url,
      organizations_url: installation.sender.organizations_url,
      repos_url: installation.sender.repos_url,
      events_url: installation.sender.events_url,
      received_events_url: installation.sender.received_events_url,
      type: installation.sender.type,
      site_admin: installation.sender.site_admin,
    }, */

    created_at: installation.created_at,
    updated_at: installation.updated_at,
    db_updated_at: new Date(),
  }

  const { error } = await supabase.from('installation').upsert(InstallationData)

  if (error) throw error
  return
}
