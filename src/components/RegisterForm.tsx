"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Loader, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await register(email, password, username);
      router.push('/');
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#141414]">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Créer un compte</h2>
            <p className="text-sm text-gray-400">
              Rejoignez AnimeFlow pour accéder à toutes les fonctionnalités
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-md mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="text-sm font-medium text-gray-300 block mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="Votre pseudo"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-300 block mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="exemple@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-300 block mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Le mot de passe doit contenir au moins 6 caractères
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                'Créer mon compte'
              )}
            </button>

            <p className="text-center text-sm text-gray-400">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="text-red-500 hover:text-red-400 font-medium">
                Se connecter
              </Link>
            </p>

            <div className="text-xs text-gray-400 text-center">
              En créant un compte, vous acceptez nos{' '}
              <a href="#" className="text-red-500 hover:text-red-400">
                Conditions d'utilisation
              </a>{' '}
              et notre{' '}
              <a href="#" className="text-red-500 hover:text-red-400">
                Politique de confidentialité
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}