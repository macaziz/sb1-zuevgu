"use client";

import React from 'react';
import { Plus, Check } from 'lucide-react';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface WatchlistButtonProps {
  anime: {
    id: number;
    title: string;
    image: string;
    genres: string[];
  };
}

export default function WatchlistButton({ anime }: WatchlistButtonProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { user } = useAuth();
  const router = useRouter();
  const isAdded = isInWatchlist(anime.id);

  const handleClick = () => {
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
        image: anime.image,
        genres: anime.genres,
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
        isAdded
          ? 'bg-gray-800 text-white hover:bg-gray-700'
          : 'bg-white text-black hover:bg-gray-200'
      }`}
    >
      {isAdded ? (
        <>
          <Check className="w-5 h-5" />
          <span>Ajouté à la liste</span>
        </>
      ) : (
        <>
          <Plus className="w-5 h-5" />
          <span>Ajouter à ma liste</span>
        </>
      )}
    </button>
  );
}