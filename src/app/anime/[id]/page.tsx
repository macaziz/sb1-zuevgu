import { Metadata } from 'next'
import { getAnimeDetails } from '@/services/tmdb'
import AnimeDetail from '@/components/AnimeDetail'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const anime = await getAnimeDetails(parseInt(params.id))
    
    const title = `${anime.title} - Regarder en Streaming`
    const description = anime.overview || `Regardez ${anime.title} en streaming HD sur AnimeFlow. Découvrez tous les épisodes de cet anime en VOSTFR.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'video.episode',
        images: [anime.backdropImage || anime.image].filter(Boolean),
        videos: anime.trailerKey ? [{
          url: `https://www.youtube.com/watch?v=${anime.trailerKey}`,
          type: 'text/html',
        }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [anime.backdropImage || anime.image].filter(Boolean),
      },
    }
  } catch (error) {
    return {
      title: 'Anime non trouvé',
    }
  }
}

export default async function AnimePage({ params }: Props) {
  try {
    const anime = await getAnimeDetails(parseInt(params.id))
    return <AnimeDetail anime={anime} />
  } catch (error) {
    notFound()
  }
}