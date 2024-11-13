"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Loader, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Veuillez entrer votre adresse email');
      return;
    }
    
    // Simuler l'envoi d'un email de réinitialisation
    setResetSent(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetSent(false);
      setResetEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[url('https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      <div className="relative max-w-md w-full">
        {!showForgotPassword ? (
          <div className="bg-gray-900/90 p-8 rounded-lg shadow-xl backdrop-blur-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Bienvenue</h2>
              <p className="text-gray-400">
                Connectez-vous pour accéder à votre compte
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-500 p-4 rounded-md mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
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
                      className="block w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
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
                      className="block w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  'Se connecter'
                )}
              </button>

              <p className="text-center text-sm text-gray-400">
                Vous n'avez pas de compte ?{' '}
                <Link href="/register" className="text-red-500 hover:text-red-400 font-medium">
                  S'inscrire
                </Link>
              </p>
            </form>
          </div>
        ) : (
          <div className="bg-gray-900/90 p-8 rounded-lg shadow-xl backdrop-blur-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Réinitialisation du mot de passe
              </h2>
              <p className="text-gray-400">
                Entrez votre email pour recevoir les instructions
              </p>
            </div>

            {resetSent ? (
              <div className="text-center">
                <p className="text-green-400 mb-4">
                  Les instructions ont été envoyées à votre adresse email
                </p>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  Retour à la connexion
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label htmlFor="reset-email" className="text-sm font-medium text-gray-300 block mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="reset-email"
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="exemple@email.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                  >
                    Envoyer les instructions
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Retour à la connexion
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}