import { useState, useEffect, useCallback } from 'react';
import { getFilteredAnime } from '@/services/tmdb';
import { Anime } from '@/types/tmdb';

interface UseAnimeListParams {
  genres?: number[];
  year?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function useAnimeList({
  genres,
  year,
  sortBy = 'popularity',
  sortDirection = 'desc'
}: UseAnimeListParams) {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchAnimes = useCallback(async (pageNumber: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFilteredAnime({
        page: pageNumber,
        genres,
        year,
        sortBy,
        sortDirection
      });
      
      if (pageNumber === 1) {
        setAnimes(data.results);
      } else {
        setAnimes(prev => [...prev, ...data.results]);
      }
      
      setHasMore(data.page < data.totalPages);
    } catch (err) {
      setError('Failed to fetch animes');
    } finally {
      setIsLoading(false);
    }
  }, [genres, year, sortBy, sortDirection]);

  useEffect(() => {
    setPage(1);
    setAnimes([]);
    fetchAnimes(1);
  }, [genres, year, sortBy, sortDirection]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAnimes(nextPage);
    }
  }, [isLoading, hasMore, page, fetchAnimes]);

  return {
    animes,
    isLoading,
    error,
    hasMore,
    loadMore
  };
}