import Image from 'next/image'
import { UserProfileImageHeader } from '../../_page/_components/userProfileImageHeader'
import LogoExtended from '@/public/myworldx_logo_ext.png'

export const DefaultHeader = () => {
  return (
    <header className="flex h-[170px] w-full items-center justify-between">
      <div className="flex items-center justify-center">
        <div className="relative z-10 flex h-[100px] w-[100px] items-center justify-center rounded-full border-[3px] border-gray-950">
          <div className="absolute left-0 top-0 -z-0 box-content">
            <UserProfileImageHeader />
          </div>
        </div>
        <div className="w-0 h-14 border-l-2 mx-2"></div>
        <div className="h-full flex flex-col items-start">
          <span className="text-sm">
            <strong>Rafael Fernandes</strong>
          </span>
          <span className="text-sm">followers: 132</span>
          <span className="text-sm">following: 123</span>
          <span className="text-sm">starts: 132</span>
        </div>
      </div>
      <div className="flex">
        <Image height={70} width={120} src={LogoExtended} alt="" />
      </div>
      <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-[40px] w-[40px]" viewBox="0 0 512 512">
          <path
            d="M192 176v-40a40 40 0 0140-40h160a40 40 0 0140 40v240a40 40 0 01-40 40H240c-22.09 0-48-17.91-48-40v-40"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M288 336l80-80-80-80M80 256h272"
          />
        </svg>
      </div>
    </header>
  )
}
