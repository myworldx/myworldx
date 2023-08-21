export async function VerifyAndReceive(request: Request) {
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

    return await __octokit.webhooks.verifyAndReceive({
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
