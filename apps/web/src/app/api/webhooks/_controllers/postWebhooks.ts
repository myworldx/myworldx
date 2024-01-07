import { LogDispatcher } from '@/config/logs'
import { VerifyAndReceiveWebhooksService } from '../../_services/webhooks/verifyAndReceiveWebhooksService'

async function POST(request: Request) {
  try {
    const requestID = request.headers.get('x-context-request-id')

    LogDispatcher({
      logName: 'post_webhook_controller',
      level: 'info',
      options: {
        message: 'POST WEBHOOK CALL',
        meta: { id: requestID },
        callback: () => console.log(`POST - LOG - WEBHOOK CONTROLLER - ${requestID}`),
        infoObject: { request: request.headers },
      },
      type: 'info',
    })

    const deliveryId = request.headers.get('x-github-delivery')
    const eventType = request.headers.get('x-github-event')

    if (!deliveryId || !eventType) {
      return new Response(null, { status: 400 })
    }

    await VerifyAndReceiveWebhooksService(request)

    return new Response(null, { status: 200 })
  } catch (error) {
    const requestID = request.headers.get('x-context-request-id')

    LogDispatcher({
      logName: 'post_webhook_controller',
      level: 'error',
      options: {
        message: 'POST webhook error request',
        meta: { id: requestID },
        callback: () => console.log('ERROR - POST - WEBHOOK CONTROLLER'),
        infoObject: { request: request.headers },
      },
      type: 'error',
    })

    return new Response("Sorry, it's a server error!", { status: 500 })
  }
}

export { POST }
