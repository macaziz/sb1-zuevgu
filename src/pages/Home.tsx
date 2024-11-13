import React from 'react';
import Carousel from '../components/Carousel';
import AnimeRow from '../components/AnimeRow';
import { 
  useTrendingAnime, 
  useTopRatedAnime, 
  useAnimeByGenre,
  useNewReleases
} from '../hooks/useAnime';
import { Loader } from 'lucide-react';

// Genre IDs from TMDB
const ACTION_GENRE_ID = 28;
const ADVENTURE_GENRE_ID = 12;
const FANTASY_GENRE_ID = 14;

export default function Home() {
  const { animes: trendingAnimes, isLoading: trendingLoading } = useTrendingAnime();
  const { animes: topRatedAnimes, isLoading: topRatedLoading } = useTopRatedAnime();
  const { animes: actionAnimes, isLoading: actionLoading } = useAnimeByGenre(ACTION_GENRE_ID);
  const { animes: adventureAnimes, isLoading: adventureLoading } = useAnimeByGenre(ADVENTURE_GENRE_ID);
  const { animes: fantasyAnimes, isLoading: fantasyLoading } = useAnimeByGenre(FANTASY_GENRE_ID);
  const { animes: newReleases, isLoading: newReleasesLoading } = useNewReleases();

  const isLoading = 
    trendingLoading || 
    topRatedLoading || 
    actionLoading || 
    adventureLoading || 
    fantasyLoading || 
    newReleasesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      {trendingAnimes.length > 0 && (
        <Carousel animes={trendingAnimes.slice(0, 5)} />
      )}
      <div className="relative z-10 -mt-32 pb-12">
        <AnimeRow title="Tendances" animes={trendingAnimes} />
        <AnimeRow title="Les Mieux Notés" animes={topRatedAnimes} />
        <AnimeRow title="Nouveautés" animes={newReleases} />
        <AnimeRow title="Action" animes={actionAnimes} />
        <AnimeRow title="Aventure" animes={adventureAnimes} />
        <AnimeRow title="Fantaisie" animes={fantasyAnimes} />
      </div>
    </div>
  );
}