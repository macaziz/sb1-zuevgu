import { 
  getTrendingAnime, 
  getTopRatedAnime, 
  getAnimeByGenre, 
  getNewReleases 
} from '@/lib/tmdb';
import Carousel from '@/components/Carousel';
import AnimeRow from '@/components/AnimeRow';

// Genre IDs from TMDB that are commonly used for anime
const ACTION_ID = 28;
const ADVENTURE_ID = 12;
const FANTASY_ID = 14;
const COMEDY_ID = 35;
const DRAMA_ID = 18;
const SCIFI_ID = 878;

export default async function Home() {
  const [
    trendingAnimes,
    topRatedAnimes,
    newReleases,
    actionAnimes,
    adventureAnimes,
    fantasyAnimes,
    comedyAnimes,
    dramaAnimes,
    scifiAnimes
  ] = await Promise.all([
    getTrendingAnime(),
    getTopRatedAnime(),
    getNewReleases(),
    getAnimeByGenre(ACTION_ID),
    getAnimeByGenre(ADVENTURE_ID),
    getAnimeByGenre(FANTASY_ID),
    getAnimeByGenre(COMEDY_ID),
    getAnimeByGenre(DRAMA_ID),
    getAnimeByGenre(SCIFI_ID)
  ]);

  return (
    <div className="min-h-screen bg-[#141414]">
      {trendingAnimes.length > 0 && (
        <div className="mb-16">
          <Carousel animes={trendingAnimes.slice(0, 5)} />
        </div>
      )}
      <div className="space-y-12 pb-12">
        <AnimeRow title="Tendances" animes={trendingAnimes} />
        <AnimeRow title="Les Mieux Notés" animes={topRatedAnimes} />
        <AnimeRow title="Nouveautés" animes={newReleases} />
        <AnimeRow title="Action" animes={actionAnimes} />
        <AnimeRow title="Aventure" animes={adventureAnimes} />
        <AnimeRow title="Fantaisie" animes={fantasyAnimes} />
        <AnimeRow title="Comédie" animes={comedyAnimes} />
        <AnimeRow title="Drame" animes={dramaAnimes} />
        <AnimeRow title="Science-Fiction" animes={scifiAnimes} />
      </div>
    </div>
  );
}