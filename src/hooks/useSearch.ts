import { useState, useEffect } from 'react';

interface AnimeResult {
  id: number;
  title: string;
  image: string;
  genres: string[];
}

// Simulated anime database
const animeDatabase: AnimeResult[] = [
  {
    id: 1,
    title: "Attack on Titan",
    image: "https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80",
    genres: ["Action", "Drama", "Fantasy"]
  },
  {
    id: 2,
    title: "Demon Slayer",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80",
    genres: ["Action", "Supernatural"]
  },
  {
    id: 3,
    title: "Jujutsu Kaisen",
    image: "https://images.unsplash.com/photo-1624969862293-b749659ccc4e?auto=format&fit=crop&q=80",
    genres: ["Action", "Supernatural"]
  },
  {
    id: 4,
    title: "One Piece",
    image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80",
    genres: ["Adventure", "Comedy", "Fantasy"]
  },
  {
    id: 5,
    title: "My Hero Academia",
    image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&q=80",
    genres: ["Action", "Superhero"]
  }
];

export function useSearch(query: string) {
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchAnime = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const searchResults = animeDatabase.filter(anime =>
          anime.title.toLowerCase().includes(query.toLowerCase()) ||
          anime.genres.some(genre => 
            genre.toLowerCase().includes(query.toLowerCase())
          )
        );
        
        setResults(searchResults);
      } finally {
        setIsLoading(false);
      }
    };

    searchAnime();
  }, [query]);

  return { results, isLoading };
}