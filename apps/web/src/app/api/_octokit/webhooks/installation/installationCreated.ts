import { WebhooksOnEventCallback } from '@/@types/octokit/core'
import { CreateInstallationService } from '@/app/api/_services/webhooks/installation/createInstallationService'

export const InstallationCreated = async ({ id, name, payload }: WebhooksOnEventCallback) => {
  try {
    await CreateInstallationService({ id, name, payload })
  } catch (e) {
    throw new Error('Error on CreateInstallationService')
  }
}
