import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/register', '/my-list'],
    },
    sitemap: 'https://animeflow.com/sitemap.xml',
  }
}