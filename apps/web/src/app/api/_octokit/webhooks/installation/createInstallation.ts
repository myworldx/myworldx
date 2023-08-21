import { EmitterWebhookEventName } from '@octokit/webhooks'
import { __ValidRepositoriesList } from '@/@types/config/rules'
import __octokit from '@/lib/octokit'

import { RepositoryCreateInstallation } from '../../../_repositories/installation'
import { RepositoriesValidator } from '../../../_utils/installationValidation'

__octokit.webhooks.on('installation.created', async ({ id, name, payload }) => {
  const installation = {
    installation_id: payload.installation.id,
    account_id: payload.installation.account.id,
    account_name: payload.installation.account.login,
    account_node: payload.installation.account.node_id,
  }
})

export async function WebHooksHandler(request: Request) {
  try {
    const [idOrNull, nameOrNull, signatureOrNull, payload] = await Promise.all([
      request.headers.get('x-github-delivery'),
      request.headers.get('x-github-event'),
      request.headers.get('x-hub-signature-256'),
      JSON.stringify(await request.json()),
    ])

    const id = idOrNull + ''
    const name = (nameOrNull + '') as EmitterWebhookEventName
    const signature = signatureOrNull + ''

    return await app.webhooks.verifyAndReceive({
      id,
      name,
      signature,
      payload,
    })
  } catch (error) {
    console.log(error)
    throw new Error('Error on WebHooksHandler')
  }
}
