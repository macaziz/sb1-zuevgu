// Types pour la compatibilité avec l'interface existante
export interface Genre {
  id: number;
  name: string;
}

export interface Anime {
  id: number;
  title: string;
  image: string | null;
  backdropImage: string | null;
  rating: number;
  genres: string[];
  genreIds: number[];
  releaseYear: number;
  overview?: string;
  // Champs supplémentaires de MongoDB
  mal_id?: number;
  type?: string;
  episodes?: number;
  status?: string;
  duration?: string;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  source?: string;
  synopsis?: string;
  url?: string;
  trailerKey?: string;
}

export interface AnimeDetails extends Anime {
  numberOfSeasons: number;
  seasons: Season[];
  recommendations: Anime[];
  nextEpisodeDate?: string | null;
  // Données d'épisodes MongoDB
  episodes_data?: MongoEpisode[];
  relations?: AnimeRelation[];
}

export interface Season {
  id: number;
  name: string;
  seasonNumber: number;
  episodeCount: number;
  airDate: string;
  overview: string;
  episodes?: Episode[];
}

export interface Episode {
  id: number;
  name: string;
  episodeNumber: number;
  seasonNumber: number;
  airDate: string;
  overview: string;
  runtime?: number;
  stillPath?: string | null;
}

// Types MongoDB spécifiques
export interface MongoTitle {
  type: string;
  title: string;
}

export interface MongoGenre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface MongoEpisode {
  mal_id: number;
  url: string;
  title: string;
  title_japanese?: string;
  title_romanji?: string;
  aired?: string;
  score?: number;
  filler: boolean;
  recap: boolean;
  forum_url?: string;
}

export interface AnimeRelation {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface MongoAnime {
  _id?: string;
  mal_id: number;
  title: string;
  titles: MongoTitle[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  aired: {
    from?: string;
    to?: string;
    prop?: {
      from?: { day?: number; month?: number; year?: number; };
      to?: { day?: number; month?: number; year?: number; };
    };
    string?: string;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  genres: MongoGenre[];
  synopsis: string;
  url: string;
  trailer?: {
    youtube_id?: string;
    url?: string;
    embed_url?: string;
    images?: {
      image_url?: string;
      small_image_url?: string;
      medium_image_url?: string;
      large_image_url?: string;
      maximum_image_url?: string;
    };
  };
  images: {
    jpg?: {
      image_url?: string;
      small_image_url?: string;
      large_image_url?: string;
    };
    webp?: {
      image_url?: string;
      small_image_url?: string;
      large_image_url?: string;
    };
  };
  relations?: AnimeRelation[];
  episodes_data?: MongoEpisode[];
  updated_at: Date;
  added_at: Date;
}

// Fonction utilitaire pour transformer MongoAnime en Anime
export function transformMongoAnime(mongoAnime: MongoAnime): Anime {
  return {
    id: mongoAnime.mal_id,
    mal_id: mongoAnime.mal_id,
    title: mongoAnime.title,
    image: mongoAnime.images.jpg?.image_url || mongoAnime.images.webp?.image_url || null,
    backdropImage: mongoAnime.images.jpg?.large_image_url || mongoAnime.images.webp?.large_image_url || null,
    rating: mongoAnime.score,
    genres: mongoAnime.genres.map(g => g.name),
    genreIds: mongoAnime.genres.map(g => g.mal_id),
    releaseYear: mongoAnime.aired?.prop?.from?.year || new Date().getFullYear(),
    overview: mongoAnime.synopsis,
    type: mongoAnime.type,
    episodes: mongoAnime.episodes,
    status: mongoAnime.status,
    duration: mongoAnime.duration,
    scored_by: mongoAnime.scored_by,
    rank: mongoAnime.rank,
    popularity: mongoAnime.popularity,
    source: mongoAnime.source,
    synopsis: mongoAnime.synopsis,
    url: mongoAnime.url,
    trailerKey: mongoAnime.trailer?.youtube_id
  };
}