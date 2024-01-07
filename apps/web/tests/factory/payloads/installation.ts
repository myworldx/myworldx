import { InstallationWebhookPayload } from '@/@types/githubApi'
import { faker } from '@faker-js/faker'
import { User } from './user'

const installation = (): InstallationWebhookPayload => ({
  action: 'created',
  installation: {
    id: faker.number.int({ min: 1, max: 1000000 }),
    account: User(),
    access_tokens_url: faker.internet.url(),
    repositories_url: faker.internet.url(),
    html_url: faker.internet.url(),
    target_id: faker.number.int({ min: 1, max: 1000000 }),
    target_type: faker.helpers.arrayElement(['User', 'Organization']),
    created_at: faker.date.recent().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    repository_selection: faker.helpers.arrayElement(['all', 'selected']),
    app_id: faker.number.int({ min: 1, max: 1000000 }),
    events: [],
    single_file_name: '',
    permissions: {
      metadata: 'read',
      contents: 'read',
      issues: 'read',
      single_file: 'read',
    },
    suspended_at: null,
    suspended_by: null,
    app_slug: '',
    has_multiple_single_files: false,
    single_file_paths: [],
  },
  repositories: [],
  sender: User(),
  requester: User(),
})

const payload = {
  installation,
}

export { payload }
