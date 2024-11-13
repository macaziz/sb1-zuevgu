"use client";

import React, { useState } from 'react';
import { Play, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimeDetails } from '@/types/tmdb';
import WatchlistButton from './WatchlistButton';
import EpisodeCountdown from './EpisodeCountdown';

interface AnimeDetailProps {
  anime: AnimeDetails;
}

export default function AnimeDetail({ anime }: AnimeDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const currentSeason = anime.seasons.find(season => season.id === selectedSeason);

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full">
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
              {anime.trailerKey && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Voir la bande-annonce
                </button>
              )}
              <WatchlistButton anime={anime} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {anime.nextEpisodeDate && (
          <EpisodeCountdown nextEpisodeDate={anime.nextEpisodeDate} />
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'overview'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Aperçu
          </button>
          <button
            onClick={() => setActiveTab('episodes')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'episodes'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Épisodes
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">{anime.overview}</p>
            </div>

            {/* Similar Animes */}
            {anime.recommendations && anime.recommendations.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-6">Animes Similaires</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {anime.recommendations.map((similarAnime) => (
                    <div
                      key={similarAnime.id}
                      onClick={() => window.location.href = `/anime/${similarAnime.id}`}
                      className="cursor-pointer group relative"
                    >
                      <div className="aspect-[2/3] rounded-lg overflow-hidden">
                        <img
                          src={similarAnime.image || ''}
                          alt={similarAnime.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <h3 className="text-white font-medium">{similarAnime.title}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Seasons List */}
            <div className="grid gap-4">
              {anime.seasons
                .filter(season => season.seasonNumber !== 0) // Exclude season 0 (specials)
                .map((season) => (
                  <div
                    key={season.id}
                    className="bg-gray-900 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setSelectedSeason(selectedSeason === season.id ? null : season.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800 transition-colors"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {season.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {season.episodeCount} Épisodes
                        </p>
                      </div>
                      {selectedSeason === season.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {/* Episodes List */}
                    {selectedSeason === season.id && season.episodes && (
                      <div className="border-t border-gray-800">
                        {season.episodes.map((episode) => (
                          <div
                            key={episode.id}
                            className="px-6 py-4 border-b border-gray-800 last:border-b-0 hover:bg-gray-800 transition-colors cursor-pointer group"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-white font-medium group-hover:text-red-500 transition-colors">
                                  Episode {episode.episodeNumber}
                                </h4>
                                <p className="text-sm text-gray-400 mt-1">
                                  {episode.name}
                                </p>
                              </div>
                              {episode.runtime && (
                                <span className="text-sm text-gray-400">
                                  {episode.runtime} min
                                </span>
                              )}
                            </div>
                            {episode.overview && (
                              <p className="text-sm text-gray-300 mt-2">
                                {episode.overview}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && anime.trailerKey && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl aspect-video">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              Fermer
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${anime.trailerKey}`}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}