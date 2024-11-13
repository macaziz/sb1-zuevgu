import { useState, useEffect } from 'react';
import { 
  getAnimeDetails, 
  getTrendingAnime, 
  searchAnime,
  getTopRatedAnime,
  getAnimeByGenre,
  getNewReleases
} from '../services/tmdb';
import { Anime, AnimeDetails } from '../types/tmdb';

export function useTrendingAnime() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTrendingAnime();
        setAnimes(data);
      } catch (err) {
        setError('Failed to fetch trending anime');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return { animes, isLoading, error };
}

export function useAnimeDetails(id: number) {
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAnimeDetails(id);
        setAnime(data);
      } catch (err) {
        setError('Failed to fetch anime details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  return { anime, isLoading, error };
}

export function useAnimeSearch(query: string) {
  const [results, setResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await searchAnime(query);
        setResults(data);
      } catch (err) {
        setError('Failed to search anime');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  return { results, isLoading, error };
}

export function useTopRatedAnime() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopRated = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTopRatedAnime();
        setAnimes(data);
      } catch (err) {
        setError('Failed to fetch top rated anime');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopRated();
  }, []);

  return { animes, isLoading, error };
}

export function useAnimeByGenre(genreId: number) {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchByGenre = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAnimeByGenre(genreId);
        setAnimes(data);
      } catch (err) {
        setError('Failed to fetch anime by genre');
      } finally {
        setIsLoading(false);
      }
    };

    fetchByGenre();
  }, [genreId]);

  return { animes, isLoading, error };
}

export function useNewReleases() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getNewReleases();
        setAnimes(data);
      } catch (err) {
        setError('Failed to fetch new releases');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  return { animes, isLoading, error };
}