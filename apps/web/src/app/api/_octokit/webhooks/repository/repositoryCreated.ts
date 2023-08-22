import { EmitterWebhookEvent } from '@octokit/webhooks'
import { CreateRespositoryService } from '@/app/api/_services/webhooks/repositories/createRepositoryService'

export async function RepositoryCreated({ id, name, payload }: EmitterWebhookEvent<'repository.created'>) {
  try {
    await CreateRespositoryService({ id, name, payload })
  } catch (e) {
    throw new Error('Error on CreateInstallationService')
  }
}
