'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export const SplashScreen = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 1000)
  }, [])

  return (
    !isMounted && (
      <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-white">
        <div className="animate-ping">
          <Image src="/myworldx-logo.png" alt="Logo" width={50} height={50} />
        </div>
      </div>
    )
  )
}
