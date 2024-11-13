import React from 'react';
import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Anime } from '../types/tmdb';
import WatchlistButton from './WatchlistButton';

interface HeroProps {
  anime: Anime;
}

export default function Hero({ anime }: HeroProps) {
  return (
    <div className="relative h-[90vh] w-full">
      <div className="absolute inset-0">
        <img
          src={anime.backdropImage || anime.image}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      </div>
      
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            {anime.title}
          </h1>
          <div className="flex items-center space-x-4 text-white mb-6">
            <span className="text-green-400">{anime.rating.toFixed(1)} Rating</span>
            <span>•</span>
            <span>{anime.releaseYear}</span>
            <span>•</span>
            <span>{anime.genres.join(' • ')}</span>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to={`/anime/${anime.id}`}
              className="flex items-center px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Play className="w-5 h-5 mr-2" />
              Regarder
            </Link>
            <WatchlistButton anime={anime} />
          </div>
        </div>
      </div>
    </div>
  );
}