import axios from 'axios';
import { Anime, AnimeDetails } from '@/types/tmdb';

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
    genres: data.genres?.map((g: any) => g.name) || data.genre_ids || [],
    releaseYear: new Date(data.first_air_date || data.release_date).getFullYear(),
    overview: data.overview,
  };
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
      .filter((anime: Anime) => anime.image)
      .slice(0, 10); // Limit to 10 animes per genre
  } catch (error) {
    console.error('Error fetching anime by genre:', error);
    return [];
  }
}