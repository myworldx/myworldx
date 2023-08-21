import Image from 'next/image'

export const ProfileImage = () => {
  return (
    <div className="flex w-full justify-center p-6">
      <div className="relative z-10 flex h-[100px] w-[100px] items-center justify-center rounded-full border-[3px] border-gray-950">
        <div className="absolute left-0 top-0 -z-0 box-content"></div>
        <Image
          width={94}
          height={94}
          className="h-[94px] w-[94px] rounded-full"
          src="https://github.com/raferdev.png"
          alt="Raferdev profile image"
        />
      </div>
    </div>
  )
}
