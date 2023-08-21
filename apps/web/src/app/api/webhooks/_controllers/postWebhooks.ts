import { WebHooksHandler } from '../_services/eventHandler'

export async function POST(req: Request) {
  try {
    await WebHooksHandler(req)
  } catch (error) {
    console.log(error)
  }
  return new Response(null, { status: 200 })
}
