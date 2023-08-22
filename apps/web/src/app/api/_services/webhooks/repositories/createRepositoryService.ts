import { EmitterWebhookEvent } from '@octokit/webhooks'
import { __ValidRepositoriesList } from '@/@types/config/rules'
import { RepositoryCreateInstallation } from '@/app/api/_repositories/installation/installation'
export async function CreateRespositoryService({ id, name, payload }: EmitterWebhookEvent<'repository.created'>) {
  try {
    const repositoryName = payload.repository.name
    const repositoryDotSplitArray = repositoryName.split('.')
    const hasRepositoryExtension = repositoryDotSplitArray.length > 1

    if (!hasRepositoryExtension) {
      return
    }
  } catch (error) {
    throw new Error('Error on CreateInstallationService')
  }
}
