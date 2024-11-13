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
}

export interface AnimeDetails extends Anime {
  trailerKey?: string;
  numberOfSeasons: number;
  seasons: Season[];
  recommendations: Anime[];
  nextEpisodeDate?: string | null;
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