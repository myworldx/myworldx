import { InstallationWebhookPayload } from '@/@types/githubApi'
import { faker } from '@faker-js/faker'

const User = (): InstallationWebhookPayload['sender'] => ({
  id: faker.number.int({ min: 1, max: 1000000 }),
  login: faker.internet.userName(),
  subscriptions_url: faker.internet.url(),
  type: faker.helpers.arrayElement(['User', 'Organization', 'Bot']),
  gravatar_id: faker.git.commitSha(),
  node_id: faker.string.alpha(20),
  events_url: faker.internet.url(),
  followers_url: faker.internet.url(),
  following_url: faker.internet.url(),
  starred_url: faker.internet.url(),
  gists_url: faker.internet.url(),
  html_url: faker.internet.url(),
  organizations_url: faker.internet.url(),
  received_events_url: faker.internet.url(),
  repos_url: faker.internet.url(),
  site_admin: faker.datatype.boolean(),
  avatar_url: faker.internet.url(),
  url: faker.internet.url(),
})

export { User }
