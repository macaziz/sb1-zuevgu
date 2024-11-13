"use client";

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Filter, SortAsc, SortDesc, Loader } from 'lucide-react';
import { getFilteredAnime } from '@/services/tmdb';
import AnimeCard from './AnimeCard';
import { Genre, Anime } from '@/types/tmdb';

interface AnimeListClientProps {
  initialGenres: Genre[];
}

export default function AnimeListClient({ initialGenres }: AnimeListClientProps) {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState('popularity.desc');

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchAnimes = async (pageNum: number, isNewSearch: boolean = false) => {
    setIsLoading(true);
    try {
      const data = await getFilteredAnime({
        page: pageNum,
        genres: selectedGenres,
        year: selectedYear,
        sortBy,
      });

      if (isNewSearch) {
        setAnimes(data.results);
      } else {
        setAnimes(prev => [...prev, ...data.results]);
      }
      
      setHasMore(data.page < data.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des animes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setAnimes([]);
    fetchAnimes(1, true);
  }, [selectedGenres, selectedYear, sortBy]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchAnimes(page + 1);
    }
  }, [inView]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1990 + 1 },
    (_, i) => currentYear - i
  );

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Liste des Animes</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {initialGenres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => {
                  setSelectedGenres(prev =>
                    prev.includes(genre.id)
                      ? prev.filter(id => id !== genre.id)
                      : [...prev, genre.id]
                  );
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedGenres.includes(genre.id)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Year */}
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)}
              className="bg-gray-800 text-white rounded-md px-3 py-1"
            >
              <option value="">Année</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white rounded-md px-3 py-1"
            >
              <option value="popularity.desc">Popularité</option>
              <option value="vote_average.desc">Note</option>
              <option value="first_air_date.desc">Date de sortie</option>
              <option value="name.asc">Titre</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {animes.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>

            <div ref={ref} className="py-8 flex justify-center">
              {isLoading && (
                <Loader className="w-8 h-8 text-red-500 animate-spin" />
              )}
            </div>

            {!hasMore && animes.length > 0 && (
              <p className="text-center text-gray-400 py-8">
                Vous avez atteint la fin de la liste
              </p>
            )}

            {!isLoading && animes.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                Aucun anime ne correspond à vos critères
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}