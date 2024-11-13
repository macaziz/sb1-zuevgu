import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/contexts/AuthContext'
import { WatchlistProvider } from '@/contexts/WatchlistContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://animeflow.com'),
  title: {
    default: 'AnimeFlow - Plateforme de Streaming Anime',
    template: '%s | AnimeFlow'
  },
  description: 'Découvrez et regardez vos animes préférés en streaming HD. Une large sélection d\'animes sous-titrés en français.',
  keywords: ['anime', 'streaming', 'japonais', 'manga', 'animation', 'séries', 'vostfr', 'simulcast'],
  authors: [{ name: 'AnimeFlow' }],
  creator: 'AnimeFlow',
  publisher: 'AnimeFlow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://animeflow.com',
    siteName: 'AnimeFlow',
    title: 'AnimeFlow - Plateforme de Streaming Anime',
    description: 'Découvrez et regardez vos animes préférés en streaming HD. Une large sélection d\'animes sous-titrés en français.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AnimeFlow - Plateforme de Streaming Anime',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnimeFlow - Plateforme de Streaming Anime',
    description: 'Découvrez et regardez vos animes préférés en streaming HD. Une large sélection d\'animes sous-titrés en français.',
    images: ['/twitter-image.jpg'],
    creator: '@animeflow',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <WatchlistProvider>
            <Navbar />
            <main>{children}</main>
          </WatchlistProvider>
        </AuthProvider>
      </body>
    </html>
  )
}