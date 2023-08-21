import { ProfileImage } from './profileImage'
import { UserDetails } from './userDetails'

export const AsideUserContent = () => {
  return (
    <aside className="flex h-full w-full flex-col items-center">
      <ProfileImage />
      <UserDetails />
    </aside>
  )
}
