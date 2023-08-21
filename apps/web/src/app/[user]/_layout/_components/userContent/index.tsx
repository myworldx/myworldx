import Image from 'next/image'
import LogoExtended from '@/public/myworldx-logo.png'

export const UserContent = () => {
  return (
    <div className="h-full w-full">
      <div className="flex h-[100px] w-[250px] items-center justify-center rounded-md">
        <Image height={70} width={70} src={LogoExtended} alt="" />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 512 512">
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
    </div>
  )
}
