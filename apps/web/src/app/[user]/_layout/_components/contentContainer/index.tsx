import { Footer } from './footer'
import { MainContent } from './mainContent'
import { NavMenu } from './navMenu'

export const ContentContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      <NavMenu />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  )
}
