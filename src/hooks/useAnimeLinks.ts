import { useState, useEffect } from 'react';

interface AnimeLink {
  episodeNumber: number;
  links: {
    hoster: string;
    url: string;
  }[];
}

interface AnimeLinks {
  animeId: number;
  episodes: AnimeLink[];
}

export function useAnimeLinks(animeId: number) {
  const [links, setLinks] = useState<AnimeLinks | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/links/${animeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch links');
        }
        const data = await response.json();
        setLinks(data);
      } catch (err) {
        setError('Failed to fetch episode links');
        console.error('Error fetching links:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (animeId) {
      fetchLinks();
    }
  }, [animeId]);

  return { links, isLoading, error };
} 