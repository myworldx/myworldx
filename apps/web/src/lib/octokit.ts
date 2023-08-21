import { App, Octokit } from 'octokit'
import { __env, __version } from '@/config/env'

const appId = __env.APP_ID
const clientSecret = __env.APP_CLIENT_SECRET
const clientId = __env.APP_CLIENT_ID
const privateKey = __env.APP_PRIVATE_KEY
const secret = __env.APP_WEBHOOK_SECRET

if (!__version) {
  throw new Error('Error while reading package version.')
}

const userAgent = `myworldx/v${__version}`

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
