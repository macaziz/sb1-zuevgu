import { Metadata } from 'next'
import MyListClient from '@/components/MyListClient'

export const metadata: Metadata = {
  title: 'Ma Liste',
  description: 'Gérez votre liste personnalisée d\'animes à regarder sur AnimeFlow.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function MyListPage() {
  return <MyListClient />
}