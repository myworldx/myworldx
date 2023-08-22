import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function ClassNameMerger(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
