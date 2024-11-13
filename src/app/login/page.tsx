import { Metadata } from 'next'
import LoginForm from '@/components/LoginForm'

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à votre compte AnimeFlow pour accéder à votre liste de lecture et vos animes favoris.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return <LoginForm />
}