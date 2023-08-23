import { supabase } from '@/lib/supabase'
import { AsideUserContent } from './_components/asideUserContent'
import { ContentContainer } from './_components/contentContainer'
import { UserContent } from './_components/userContent'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const user = await supabase.from('installation').select('*')
  console.log(user)
  return (
    <html>
      <body className="grid h-full w-full grid-cols-default">
        <AsideUserContent />
        <ContentContainer>{children}</ContentContainer>
        <UserContent />
      </body>
    </html>
  )
}
