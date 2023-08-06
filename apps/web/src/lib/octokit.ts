import { App, Octokit } from 'octokit'
import packageFile from '@/../package.json' assert { type: 'json' }
import { env } from '@/config/env'

const { version } = packageFile

const appId = env.APP_ID
const clientSecret = env.APP_CLIENT_SECRET
const clientId = env.APP_CLIENT_ID
const privateKey = env.APP_PRIVATE_KEY
const secret = env.APP_WEBHOOK_SECRET

if (!version) {
  throw new Error('Error while reading package version.')
}

const userAgent = `raferdev_study/v${version}`

const _app = new App({
  appId,
  privateKey,
  oauth: {
    clientId,
    clientSecret,
  },
  webhooks: {
    secret,
  },
  Octokit: Octokit.defaults({
    userAgent,
  }),
})

export default _app
