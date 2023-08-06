import { __extensions } from '@/config/rules'
import { Repository } from '../webhooks/schemas'

export type __ExtensionsKeys = keyof typeof __extensions

export type __ExtensionsObject = typeof __extensions

export interface __ValidRepositories extends Repository {
  type: __ExtensionsKeys
}

export type __ValidRepositoriesList = __ValidRepositories[]
