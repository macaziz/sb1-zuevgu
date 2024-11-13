"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Anime } from '@/types/tmdb';
import WatchlistButton from './WatchlistButton';

interface CarouselProps {
  animes: Anime[];
}

export default function Carousel({ animes }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const SLIDE_DURATION = 8000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % animes.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [animes.length]);

  const handlePrevious = () => {
    setCurrentIndex((current) => (current - 1 + animes.length) % animes.length);
  };

  const handleNext = () => {
    setCurrentIndex((current) => (current + 1) % animes.length);
  };

  if (!animes.length) return null;

  const currentAnime = animes[currentIndex];

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          opacity: 1,
          transform: 'scale(1.05)',
        }}
      >
        <img
          src={currentAnime.backdropImage || currentAnime.image}
          alt={currentAnime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in">
            {currentAnime.title}
          </h1>
          <div className="flex items-center space-x-4 text-white mb-6">
            <span className="text-green-400">{currentAnime.rating.toFixed(1)} Rating</span>
            <span>•</span>
            <span>{currentAnime.releaseYear}</span>
            <span>•</span>
            <span>{currentAnime.genres.join(' • ')}</span>
          </div>

          <div className="flex space-x-4">
            <Link
              href={`/anime/${currentAnime.id}`}
              className="flex items-center px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Voir les détails
            </Link>
            <WatchlistButton anime={currentAnime} />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-red-600 rounded-full"
          style={{
            width: '100%',
            animation: `progress ${SLIDE_DURATION}ms linear infinite`,
          }}
        />
      </div>
    </div>
  );
}