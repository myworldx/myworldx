import { WebHooksHandler } from '../_services/webhooks/eventHandler'

export async function POST(req: Request) {
  try {
    await WebHooksHandler(req)
  } catch (error) {
    console.log(error)
  }
  return new Response(null, { status: 200 })
}

export async function GET(request: Request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
