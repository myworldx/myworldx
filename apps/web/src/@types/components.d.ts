import { Icons } from '@/components/icons'

type OptProps<T> = React.HTMLAttributes<T>

interface ClassNameOptPropsOptChildren<T> extends ClassNameOptProps<T> {
  children?: React.ReactNode
}

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export type MainNavItem = NavItem

export type SidebarNavItem = NavItemWithChildren
