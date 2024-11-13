import { Metadata } from 'next'
import RegisterForm from '@/components/RegisterForm'

export const metadata: Metadata = {
  title: 'Inscription',
  description: 'Créez votre compte AnimeFlow pour accéder à toutes les fonctionnalités et gérer votre liste de lecture.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RegisterPage() {
  return <RegisterForm />
}