export const META_THEME_COLORS = {
  light: '#fffdfa',
  dark: '#100e0b',
} as const

export const siteConfig = {
  name: 'myworldx',
  url: 'https://myworldx.dev',
  description: 'Your GitHub repositories, rendered as a site. Files and folders become pages.',
  author: 'raferdev',
  links: {
    github: 'https://github.com/myworldx/myworldx',
  },
} as const

export type SiteConfig = typeof siteConfig
