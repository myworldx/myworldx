import { supabase } from '@/lib/supabase'

export async function RepositoryCreateInstallation({ installation }: { installation: any }) {
  const InstallationData: any = {
    installation_id: installation.installation_id,
    account_id: installation.account_id,
    account_name: installation.account_name,
    account_node: installation.account_node,
  }

  const { error } = await supabase.from('installations').upsert(InstallationData)

  if (error) throw new Error('Error on CreateInstall')

  return
}
