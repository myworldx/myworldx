import { EmitterWebhookEvent } from '@octokit/webhooks'
import { CreateInstallationService } from '@/app/api/_services/webhooks/installation/createInstallationService'

export async function InstallationCreated({ id, name, payload }: EmitterWebhookEvent<'installation.created'>) {
  try {
    await CreateInstallationService({ id, name, payload })
  } catch (e) {
    throw new Error('Error on CreateInstallationService')
  }
}
