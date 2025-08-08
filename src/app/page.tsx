import { 
  getTrendingAnimeServer, 
  getTopRatedAnimeServer, 
  getAnimeByGenreServer, 
  getNewReleasesServer 
} from '@/services/animeServiceServer';
import Carousel from '@/components/Carousel';
import AnimeRow from '@/components/AnimeRow';

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
    getTrendingAnimeServer(),
    getTopRatedAnimeServer(),
    getNewReleasesServer(),
    getAnimeByGenreServer('Action'),
    getAnimeByGenreServer('Adventure'),
    getAnimeByGenreServer('Fantasy'),
    getAnimeByGenreServer('Comedy'),
    getAnimeByGenreServer('Drama'),
    getAnimeByGenreServer('Sci-Fi')
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