import { __ExtensionsKeys, __ValidRepositoriesList } from '@/@types/config/rules'
import { InstallationRepositoryList } from '@/@types/webhooks/schemas'
import { __VALID_EXTENSIONS_MAP } from '@/config/rules'

export function MapValidRepositories({ repositories }: { repositories: InstallationRepositoryList; owner: string }) {
  const validRepositoriesList = repositories.reduce<__ValidRepositoriesList>((validRepositories, repository) => {
    const repositoryArray = repository.name.split('.')
    if (repositoryArray.length < 2) {
      return validRepositories
    }

    const repositoryExtension = repositoryArray[repositoryArray.length - 1] as __ExtensionsKeys

    if (__VALID_EXTENSIONS_MAP[repositoryExtension]?.valid) {
      validRepositories.push({
        ...repository,
        db_display_name: repository.name,
        db_blob_name: repository.name,
        db_blob_url: repository.name,
        type: repositoryExtension,
      })
    }
    return validRepositories
  }, [])

  return validRepositoriesList
}
