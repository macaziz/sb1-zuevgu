import React from 'react';
import AnimeCard from './AnimeCard';
import { Anime } from '@/types/tmdb';

interface AnimeRowProps {
  title: string;
  animes: Anime[];
}

export default function AnimeRow({ title, animes }: AnimeRowProps) {
  if (!animes || animes.length === 0) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
          {animes.map((anime) => (
            <div key={anime.id} className="flex-none w-[200px] sm:w-[220px] md:w-[240px]">
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}