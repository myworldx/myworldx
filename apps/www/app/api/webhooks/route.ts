import { revalidateTag } from 'next/cache'

import { repositoryIndex } from '@/lib/repository-index'
import { accountTag, handleWebhook } from '@/lib/webhooks/handle'

export async function POST(request: Request) {
  const result = await handleWebhook(
    {
      event: request.headers.get('x-github-event'),
      delivery: request.headers.get('x-github-delivery'),
      signature: request.headers.get('x-hub-signature-256'),
      body: await request.text(),
    },
    {
      secret: process.env.APP_WEBHOOK_SECRET,
      index: repositoryIndex,
      revalidate: (login) => revalidateTag(accountTag(login), { expire: 0 }),
    }
  )

  return Response.json(result.body, { status: result.status })
}
