import { __ExtensionsKeys, __ValidRepositoriesList } from '@/@types/config/rules'
import { InstallationRepositoryList, RepositoriesList } from '@/@types/webhooks/schemas'
import { __extensions } from '@/config/rules'
import _app from '@/lib/octokit'

async function VerifyRepositoryMarkdownFiles(repositorys: any) {
  try {
    const RepositoriesArray = await Promise.all(
      repositorys.map(async (repository: any) => {
        await _app.octokit.graphql(`
      query RepoFiles($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          object(expression: "HEAD:") {
            ... on Tree {
              entries {
                name
                type
                object {
                  ... on Blob {
                    byteSize
                  }
      
                  # One level down.
                  ... on Tree {
                    entries {
                      name
                      type
                      object {
                        ... on Blob {
                          byteSize
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
  variables: {
    owner: ${repository.owner},
    name: ${repository.name}
  }    
  `)
      }),
    )

    return RepositoriesArray
  } catch (error) {
    console.log(error)
  }
  throw new Error('Error on verify repository files1')
}

export function RepositoriesValidator({ repositories }: { repositories: InstallationRepositoryList; owner: string }) {
  const validRepositoriesList = repositories.reduce<__ValidRepositoriesList>((validRepositories, repository) => {
    const repositoryArray = repository.name.split('.')
    if (repositoryArray.length < 2) {
      return validRepositories
    }

    const repositoryExtension = repositoryArray[repositoryArray.length - 1] as __ExtensionsKeys

    if (__extensions[repositoryExtension]?.valid) {
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
