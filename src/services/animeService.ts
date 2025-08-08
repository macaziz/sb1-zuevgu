import axios from 'axios';
import { Anime, AnimeDetails } from '@/types/tmdb';

// Fonction pour obtenir la base URL appropriée
function getBaseURL() {
  // Côté serveur (pendant generateMetadata, etc.)
  if (typeof window === 'undefined') {
    return process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
      ? `${process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}`}/api/animes`
      : 'http://localhost:3000/api/animes';
  }
  // Côté client
  return '/api/animes';
}

const api = axios.create({
  baseURL: getBaseURL(),
});

// Interface pour les paramètres de filtrage
export interface AnimeFilters {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  genres?: number[]; // Support pour les anciens composants qui utilisent un tableau
  year?: number;
  sortBy?: 'score' | 'popularity' | 'title' | 'episodes' | 'year';
  status?: string;
  type?: string;
}

// Interface pour la réponse paginée
export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export async function getTrendingAnime(limit: number = 20): Promise<Anime[]> {
  try {
    const response = await api.get('/trending', {
      params: { limit }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    return [];
  }
}

export async function getTopRatedAnime(limit: number = 20): Promise<Anime[]> {
  try {
    const response = await api.get('/top-rated', {
      params: { limit }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching top rated anime:', error);
    return [];
  }
}

export async function getNewReleases(limit: number = 20): Promise<Anime[]> {
  try {
    const response = await api.get('/new-releases', {
      params: { limit }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching new releases:', error);
    return [];
  }
}

export async function searchAnime(query: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<Anime>> {
  try {
    const response = await api.get('/search', {
      params: { q: query, page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching anime:', error);
    return {
      results: [],
      page: 1,
      total_pages: 0,
      total_results: 0
    };
  }
}

export async function getAnimeDetails(id: number): Promise<AnimeDetails | null> {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    return null;
  }
}

export async function getFilteredAnime(filters: AnimeFilters): Promise<PaginatedResponse<Anime>> {
  try {
    const params: any = { ...filters };
    
    // Convertir le tableau de genres en chaîne pour l'API
    if (filters.genres && filters.genres.length > 0) {
      params.genres = filters.genres.join(',');
    }
    
    const response = await api.get('/', {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered anime:', error);
    return {
      results: [],
      page: 1,
      total_pages: 0,
      total_results: 0
    };
  }
}

export async function getAnimeByGenre(genreName: string, limit: number = 20): Promise<Anime[]> {
  try {
    const response = await api.get('/', {
      params: { 
        genre: genreName, 
        limit,
        sortBy: 'score'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching anime by genre:', error);
    return [];
  }
}

export async function getGenres(): Promise<any[]> {
  try {
    const response = await api.get('/genres');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}

// Les fonctions sont déjà exportées individuellement, pas besoin de les re-exporter