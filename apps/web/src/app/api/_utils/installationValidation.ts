import { __ExtensionsKeys, __ValidRepositoriesList } from '@/@types/config/rules'
import { InstallationRepositoryList } from '@/@types/webhooks/schemas'
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
