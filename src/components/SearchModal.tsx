"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader } from 'lucide-react';
import { useAnimeSearch } from '../hooks/useAnime';
import { useRouter } from 'next/navigation';
import AnimeCard from './AnimeCard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const { results, isLoading } = useAnimeSearch(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleAnimeClick = (animeId: number) => {
    onClose();
    router.push(`/anime/${animeId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher un anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-900 text-white pl-14 pr-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
          />
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-8 h-8 text-red-500 animate-spin" />
            </div>
          ) : query ? (
            results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((anime) => (
                  <div
                    key={anime.id}
                    onClick={() => handleAnimeClick(anime.id)}
                    className="cursor-pointer"
                  >
                    <AnimeCard anime={anime} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  Aucun résultat trouvé pour "{query}"
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                Commencez à taper pour rechercher un anime
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}