import { __ExtensionsKeys, __ValidRepositoriesList } from '@/@types/config/rules'
import { RepositoriesList } from '@/@types/webhooks/schemas'
import { __extensions } from '@/config/rules'

export function RepositoriesValidator({ repositories }: { repositories: RepositoriesList }) {
  const validRepositoriesList = repositories.reduce<__ValidRepositoriesList>((validRepositories, repository) => {
    const repositoryArray = repository.name.split('.')
    if (repositoryArray.length < 2) {
      return validRepositories
    }

    const repositoryExtension = repositoryArray[repositoryArray.length - 1] as __ExtensionsKeys

    if (__extensions[repositoryExtension]?.valid) {
      validRepositories.push({
        ...repository,
        type: repositoryExtension,
      })
    }
    return validRepositories
  }, [])
  return validRepositoriesList
}
