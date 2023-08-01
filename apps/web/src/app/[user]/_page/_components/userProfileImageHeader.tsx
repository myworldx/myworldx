'use client'

import * as HoverCard from '@radix-ui/react-hover-card'
import Image from 'next/image'

export function UserProfileImageHeader() {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <a
          className="inline-block cursor-pointer rounded-full"
          href="https://github.com/raferdev"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Image
            width={100}
            height={100}
            className="h-[100px] w-[100px] rounded-full"
            src="https://github.com/raferdev.png"
            alt="Raferdev profile image"
          />
        </a>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className="w-[300px] rounded-[6px] bg-white p-[20px] shadow-md" sideOffset={5}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <Image
              width={60}
              height={60}
              className="h-[60px] w-[60px] rounded-full"
              src="https://github.com/raferdev.png"
              alt="Raferdev profile image"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <div>
                <div className="font-bold">Raferdev</div>
                <div className="text-slate-900">@raferdev</div>
              </div>
              <div className="font-bold">
                Components, icons, colors, and templates for building high-quality, accessible UI. Free and open-source.
              </div>
              <div style={{ display: 'flex', gap: 15 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  <div className="font-bold">0</div> <div className="text-slate-400">Following</div>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <div className="font-bold">2,900</div> <div className="text-slate-400">Followers</div>
                </div>
              </div>
            </div>
          </div>

          <HoverCard.Arrow className="fill-white" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}
