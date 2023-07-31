import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: '/',
      lastModified: new Date(),
    },
    {
      url: '/about',
      lastModified: new Date(),
    },
    {
      url: '/blog',
      lastModified: new Date(),
    },
  ]
}
