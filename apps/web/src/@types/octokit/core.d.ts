import { EmitterWebhookEventName } from '@octokit/webhooks'
import { InstallationEvent } from '../webhooks/schemas'

export type WebhooksOnEventCallback = {
  id: string
  name: EmitterWebhookEventName
  payload: InstallationEvent
}
