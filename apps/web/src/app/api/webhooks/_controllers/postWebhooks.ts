import { VerifyAndReceiveWebhooksService } from '../../_services/webhooks/verifyAndReceiveWebhooksService'

export async function POST(req: Request) {
  try {
    await VerifyAndReceiveWebhooksService(req)
  } catch (error) {
    console.log(error)
  }
  return new Response(null, { status: 200 })
}
