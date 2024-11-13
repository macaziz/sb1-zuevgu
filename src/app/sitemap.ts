import { MetadataRoute } from 'next'
import { getTrendingAnime, getTopRatedAnime } from '@/lib/tmdb'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://animeflow.com'

  // Get dynamic anime pages
  const [trendingAnimes, topRatedAnimes] = await Promise.all([
    getTrendingAnime(),
    getTopRatedAnime(),
  ])

  const animes = [...trendingAnimes, ...topRatedAnimes]
    .filter((anime, index, self) => 
      index === self.findIndex((t) => t.id === anime.id)
    )

  const animeUrls = animes.map((anime) => ({
    url: `${baseUrl}/anime/${anime.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Static pages
  const routes = [
    '',
    '/anime-list',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  return [...routes, ...animeUrls]
}