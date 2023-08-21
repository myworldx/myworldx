import __octokit from '@/lib/octokit'
import { InstallationCreated } from './webhooks/installation/installationCreated'

__octokit.webhooks.on('installation.created', InstallationCreated)

export default __octokit
