import { EmitterWebhookEventName } from '@octokit/webhooks'
import octokit from '@/app/api/_octokit/core'

export async function VerifyAndReceiveWebhooksService(request: Request) {
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

    return await octokit.webhooks.verifyAndReceive({
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
