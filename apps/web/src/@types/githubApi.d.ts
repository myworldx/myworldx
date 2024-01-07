import { EmitterWebhookEvent } from '@octokit/webhooks'

type InstallationWebhookPayload = EmitterWebhookEvent<'installation.created'>['payload']

export { InstallationWebhookPayload }
