import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar'

export const ProfileImage = () => {
  return (
    <Avatar className="h-24 w-24 rounded-full">
      <AvatarImage src="https://github.com/raferdev.png" alt="Raferdev profile image" />
      <AvatarFallback>RF</AvatarFallback>
    </Avatar>
  )
}
