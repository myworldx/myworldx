import { __VALID_EXTENSIONS_MAP } from '@/config/rules'

export function SearchByExtensions(repositoryArr: string[]) {
  const repositoryExtension = repositoryArr[repositoryArr.length - 1]

  if (__VALID_EXTENSIONS_MAP[repositoryExtension]?.valid) {
    return true
  }
  return false
}
