import { __ValidRepositoriesList } from '@/@types/config/rules'
import { MapValidRepositories } from '@/app/api/_utils/mapValidRepositories'

export function CreateInstallationService({ data, repos }: { data: any; repos: any }) {
  let pages = [] as __ValidRepositoriesList

  if (repos) {
    pages = MapValidRepositories({ data, repos })
  }
}
