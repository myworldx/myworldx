import Image from 'next/image'
import { SplashScreen } from '@/components/SplashScreen/splashScreen'

export default function Home() {
  return (
    <>
      <SplashScreen />
      <div className="grid h-96 w-64 grid-cols-1 grid-rows-3 content-center justify-items-center">
        <Image src="/myworldx-logo.png" alt="Logo" width={200} height={200} />
        <div></div>
        <div className="flex flex-col items-center  ">
          <h1>Myworldx</h1>
          <p>Welcome to myworldx!</p>
        </div>
      </div>
    </>
  )
}
