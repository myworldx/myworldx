import { M_PLUS_1 } from 'next/font/google'
import { UserProfileImageHeader } from './_components/userProfileImageHeader'
import { MarkdownMainContent } from './_components/markdownMainContent'

const logoFont = M_PLUS_1({
  weight: '800',
  subsets: ['latin'],
})

export default function UserPage() {
  return (
    <div className="flex h-screen w-screen flex-col pt-[150px]">
      <header className="fixed right-0 top-0 flex h-[150px] w-full items-center justify-center shadow-sm	">
        <div className="flex items-center justify-center">
          <div className="relative z-10 mr-[-20px] flex h-[120px] w-[120px] items-center justify-center rounded-full border-[10px] border-gray-950">
            <div className="absolute left-0 top-0 -z-0 box-content"></div>
            <UserProfileImageHeader />
          </div>
          <h1
            className={`${logoFont.className} bg-gradient-to-r from-neutral-950 to-slate-900 bg-clip-text p-1 text-[80px] tracking-[-0.1em] text-transparent`}
          >
            Raferdev
          </h1>
        </div>
      </header>
      <div className="h-full w-full flex items-center flex-col">
        <h1>Hellow i'm a user</h1>
        <MarkdownMainContent />
      </div>
    </div>
  )
}
