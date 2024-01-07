import { EmitterWebhookEvent } from '@octokit/webhooks'
import { LogDispatcher } from '@/config/logs'
import { installationRepository } from '@/repositories/webhooks/installationRepository'

export async function CreateInstallationService({ id, name, payload }: EmitterWebhookEvent<'installation.created'>) {
  try {
    LogDispatcher({
      logName: 'octokit_installation_created',
      level: 'info',
      options: {
        message: 'POST WEBHOOK CALL',
        meta: { id },
        callback: () => console.log(`POST - LOG - WEBHOOK CONTROLLER - ${id}`),
        infoObject: { request: id },
      },
      type: 'info',
    })
    await installationRepository.create(payload)
  } catch (error) {
    LogDispatcher({
      logName: 'verify_and_receive_webhooks_service',
      level: 'error',
      options: {
        meta: {
          id: 'id-not-found',
          error,
        },
        message: 'Error on VerifyAndReceiveWebhooksService',
      },
      type: 'error',
    })
    return new Response('Sorry, it is a server error!', { status: 500 })
  }
}
