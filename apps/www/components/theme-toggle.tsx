'use client'

import * as React from 'react'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@myworldx/ui/lib/utils'

const OPTIONS = [
  { value: 'system', label: 'System theme', Icon: MonitorIcon },
  { value: 'light', label: 'Light theme', Icon: SunIcon },
  { value: 'dark', label: 'Dark theme', Icon: MoonIcon },
] as const

function useHydrated() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const hydrated = useHydrated()

  return (
    <div role="radiogroup" aria-label="Theme" className={cn('flex items-center gap-0.5', className)}>
      {OPTIONS.map(({ value, label, Icon }) => {
        const selected = hydrated && theme === value

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-label={label}
            aria-checked={selected}
            onClick={() => setTheme(value)}
            className={cn(
              'flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              selected && 'bg-accent text-accent-foreground'
            )}
          >
            <Icon className="size-3.5" />
          </button>
        )
      })}
    </div>
  )
}
