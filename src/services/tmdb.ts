import axios from 'axios';
import { Anime, AnimeDetails, Genre } from '@/types/tmdb';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const ANIME_KEYWORDS = '210024|287501';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'fr-FR',
  },
});

function transformAnimeResponse(data: any): Anime {
  return {
    id: data.id,
    title: data.name || data.title,
    image: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
    backdropImage: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null,
    rating: data.vote_average,
    genres: data.genres?.map((g: any) => g.name) || [],
    genreIds: data.genre_ids || [],
    releaseYear: new Date(data.first_air_date || data.release_date).getFullYear(),
    overview: data.overview,
  };
}

export async function getFilteredAnime({ 
  page = 1, 
  genres, 
  year, 
  sortBy = 'popularity.desc' 
}: { 
  page?: number;
  genres?: number[];
  year?: number;
  sortBy?: string;
}) {
  try {
    const params: any = {
      with_keywords: ANIME_KEYWORDS,
      sort_by: sortBy,
      page,
    };

    if (genres?.length) {
      params.with_genres = genres.join(',');
    }

    if (year) {
      params.first_air_date_year = year;
    }

    const response = await api.get('/discover/tv', { params });

    return {
      results: response.data.results
        .map(transformAnimeResponse)
        .filter((anime: Anime) => anime.image),
      page: response.data.page,
      totalPages: response.data.total_pages,
    };
  } catch (error) {
    console.error('Error fetching filtered anime:', error);
    return { results: [], page: 1, totalPages: 1 };
  }
}

export async function getAnimeDetails(id: number): Promise<AnimeDetails> {
  try {
    const [details, videos, recommendations, seasons] = await Promise.all([
      api.get(`/tv/${id}`),
      api.get(`/tv/${id}/videos`),
      api.get(`/tv/${id}/recommendations`),
      api.get(`/tv/${id}/season/1`),
    ]);

    const trailer = videos.data.results.find((video: any) => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );

    const nextEpisodeDate = details.data.next_episode_to_air?.air_date || null;

    // Get the genre IDs of the current anime
    const animeGenreIds = details.data.genres.map((g: any) => g.id);

    // Filter recommendations to only include anime with similar genres
    const similarAnime = recommendations.data.results
      .filter((anime: any) => {
        const genreIds = anime.genre_ids || [];
        return genreIds.some(id => animeGenreIds.includes(id));
      })
      .map(transformAnimeResponse)
      .filter((anime: Anime) => anime.image)
      .slice(0, 8);

    return {
      ...transformAnimeResponse(details.data),
      trailerKey: trailer?.key,
      numberOfSeasons: details.data.number_of_seasons,
      seasons: details.data.seasons
        .filter((season: any) => season.season_number !== 0)
        .map((season: any) => ({
          id: season.id,
          name: season.name,
          seasonNumber: season.season_number,
          episodeCount: season.episode_count,
          airDate: season.air_date,
          overview: season.overview,
          episodes: seasons.data.episodes?.map((episode: any) => ({
            id: episode.id,
            name: episode.name,
            episodeNumber: episode.episode_number,
            seasonNumber: episode.season_number,
            airDate: episode.air_date,
            overview: episode.overview,
            runtime: episode.runtime,
            stillPath: episode.still_path,
          })) || [],
        })),
      recommendations: similarAnime,
      nextEpisodeDate,
    };
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
}

export async function getTrendingAnime(): Promise<Anime[]> {
  try {
    const response = await api.get('/discover/tv', {
      params: {
        with_keywords: ANIME_KEYWORDS,
        sort_by: 'popularity.desc',
      },
    });

    return response.data.results
      .map(transformAnimeResponse)
      .filter((anime: Anime) => anime.image);
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    return [];
  }
}

export async function getTopRatedAnime(): Promise<Anime[]> {
  try {
    const response = await api.get('/discover/tv', {
      params: {
        with_keywords: ANIME_KEYWORDS,
        sort_by: 'vote_average.desc',
        'vote_count.gte': 100,
      },
    });

    return response.data.results
      .map(transformAnimeResponse)
      .filter((anime: Anime) => anime.image);
  } catch (error) {
    console.error('Error fetching top rated anime:', error);
    return [];
  }
}

export async function getNewReleases(): Promise<Anime[]> {
  const currentDate = new Date().toISOString().split('T')[0];
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  try {
    const response = await api.get('/discover/tv', {
      params: {
        with_keywords: ANIME_KEYWORDS,
        'air_date.gte': threeMonthsAgo.toISOString().split('T')[0],
        'air_date.lte': currentDate,
        sort_by: 'first_air_date.desc',
      },
    });

    return response.data.results
      .map(transformAnimeResponse)
      .filter((anime: Anime) => anime.image);
  } catch (error) {
    console.error('Error fetching new releases:', error);
    return [];
  }
}

export async function getGenres(): Promise<Genre[]> {
  try {
    const response = await api.get('/genre/tv/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}

export async function searchAnime(query: string): Promise<Anime[]> {
  try {
    const response = await api.get('/search/tv', {
      params: {
        query,
        with_keywords: ANIME_KEYWORDS,
      },
    });

    return response.data.results
      .map(transformAnimeResponse)
      .filter((anime: Anime) => anime.image);
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
}

export async function getAnimeByGenre(genreId: number): Promise<Anime[]> {
  try {
    const response = await api.get('/discover/tv', {
      params: {
        with_keywords: ANIME_KEYWORDS,
        with_genres: genreId,
        sort_by: 'popularity.desc',
      },
    });

    return response.data.results
      .map(transformAnimeResponse)
      .filter((anime: Anime) => anime.image);
  } catch (error) {
    console.error('Error fetching anime by genre:', error);
    return [];
  }
}