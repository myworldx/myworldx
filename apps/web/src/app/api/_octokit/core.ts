import __octokit from '@/lib/octokit'
import { InstallationCreated } from './webhooks/installation/installationCreated'
import { RepositoryCreated } from './webhooks/repository/repositoryCreated'

__octokit.webhooks.on('installation.created', InstallationCreated)
__octokit.webhooks.on('repository.created', RepositoryCreated)

export default __octokit
