"use client";

import React from 'react';
import { Heart } from 'lucide-react';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Anime } from '@/types/tmdb';

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const isAdded = isInWatchlist(anime.id);

  const handleClick = () => {
    router.push(`/anime/${anime.id}`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      router.push('/login');
      return;
    }

    if (isAdded) {
      removeFromWatchlist(anime.id);
    } else {
      addToWatchlist({
        animeId: anime.id,
        title: anime.title,
        image: anime.image || '',
        genres: anime.genres,
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div
        onClick={handleClick}
        className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 hover:ring-2 hover:ring-red-500 transition-all duration-300 cursor-pointer"
      >
        <img
          src={anime.image || ''}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-100">
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isAdded 
                ? 'bg-red-600 text-white' 
                : 'bg-black/50 text-white hover:bg-red-600/80'
            }`}
          >
            <Heart 
              className={`w-4 h-4 transition-all duration-300 ${
                isAdded ? 'fill-current' : 'hover:fill-current'
              }`}
            />
          </button>

          <div className="absolute bottom-0 p-3 w-full">
            <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
              {anime.title}
            </h3>
            {anime.rating && (
              <p className="text-green-400 text-xs">
                Note: {anime.rating.toFixed(1)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}