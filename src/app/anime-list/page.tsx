import { Metadata } from 'next'
import AnimeListClient from '@/components/AnimeListClient'
import { getGenresServer } from '@/services/animeServiceServer'

export const metadata: Metadata = {
  title: 'Liste des Animes',
  description: 'Explorez notre catalogue complet d\'animes. Filtrez par genre, année et popularité pour trouver votre prochain anime à regarder.',
  openGraph: {
    title: 'Liste des Animes | AnimeFlow',
    description: 'Explorez notre catalogue complet d\'animes. Filtrez par genre, année et popularité pour trouver votre prochain anime à regarder.',
  },
}

export default async function AnimeListPage() {
  const genres = await getGenresServer()
  return <AnimeListClient initialGenres={genres} />
}