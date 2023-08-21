import { __ValidRepositoriesList } from '@/@types/config/rules'
import { RepositoryCreateInstallation } from '@/app/api/_repositories/installation/installation'

export async function CreateInstallationService({ id, name, payload }: { id: any; name: any; payload: any }) {
  /*   let pages = [] as __ValidRepositoriesList
   */
  /*   const repositories = payload.repositories
  const owner = payload.installation.account.login
 */
  try {
    const installation = {
      installation_id: payload.installation.id,
      account_id: payload.installation.account.id,
      account_name: payload.installation.account.login,
      account_node: payload.installation.account.node_id,
    }
    /* 
    if (repositories) {
      pages = MapValidRepositories({ repositories, owner })
    }
     */
    await RepositoryCreateInstallation({ installation })
  } catch (error) {
    console.log(error)
    throw new Error('Error on CreateInstallationService')
  }
}
