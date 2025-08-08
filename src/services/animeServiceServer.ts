// Service anime pour l'exécution côté serveur (dans generateMetadata, etc.)
import dbConnect from '@/lib/dbConnect';
import Anime from '@/models/Anime';
import { transformMongoAnime, type AnimeDetails, type Anime as AnimeType } from '@/types/tmdb';

// Données de fallback pour éviter les erreurs quand MongoDB n'est pas configuré
const fallbackAnime: AnimeType = {
  id: 1,
  title: "Configuration MongoDB requise",
  image: null,
  backdropImage: null,
  rating: 0,
  genres: ["Configuration"],
  genreIds: [1],
  releaseYear: 2025,
  overview: "Veuillez configurer votre connexion MongoDB dans le fichier .env.local"
};

const fallbackAnimes: AnimeType[] = [fallbackAnime];

export async function getAnimeDetailsServer(id: number): Promise<AnimeDetails | null> {
  try {
    await dbConnect();
    
    // Récupérer l'anime principal
    const anime = await Anime.findOne({ mal_id: id }).lean();
    
    if (!anime) {
      return null;
    }

    // Récupérer les recommandations basées sur les genres similaires
    const genreIds = (anime as any).genres.map((g: any) => g.mal_id);
    const recommendations = await Anime.find({
      mal_id: { $ne: id },
      'genres.mal_id': { $in: genreIds }
    })
    .sort({ score: -1 })
    .limit(8)
    .lean();

    // Transformer les données
    const transformedAnime = transformMongoAnime(anime as any);
    const transformedRecommendations = recommendations.map(rec => transformMongoAnime(rec as any));

    // Construire la réponse avec le format AnimeDetails
    const animeDetails: AnimeDetails = {
      ...transformedAnime,
      numberOfSeasons: (anime as any).relations?.filter((r: any) => r.type === 'sequel' || r.type === 'prequel').length || 1,
      seasons: [], // Pas de données de saisons dans MongoDB pour l'instant
      recommendations: transformedRecommendations,
      nextEpisodeDate: null,
      episodes_data: (anime as any).episodes_data,
      relations: (anime as any).relations
    };

    return animeDetails;

  } catch (error) {
    console.error('Error fetching anime details server-side:', error);
    // Retourner un fallback au lieu de null pour éviter les erreurs de rendu
    return {
      ...fallbackAnime,
      numberOfSeasons: 1,
      seasons: [],
      recommendations: [],
      nextEpisodeDate: null,
      episodes_data: [],
      relations: []
    };
  }
}

export async function getGenresServer(): Promise<any[]> {
  try {
    await dbConnect();
    
    // Récupérer tous les genres uniques depuis la base de données
    const genres = await Anime.aggregate([
      { $unwind: '$genres' },
      { 
        $group: { 
          _id: '$genres.mal_id',
          name: { $first: '$genres.name' },
          type: { $first: '$genres.type' },
          url: { $first: '$genres.url' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }, // Trier par popularité (nombre d'animes)
      {
        $project: {
          mal_id: '$_id',
          name: 1,
          type: 1,
          url: 1,
          count: 1,
          _id: 0
        }
      }
    ]);

    return genres;

  } catch (error) {
    console.error('Error fetching genres server-side:', error);
    return [{ mal_id: 1, name: "Configuration", type: "genre", url: "#", count: 1 }];
  }
}

export async function getTrendingAnimeServer(limit: number = 20): Promise<AnimeType[]> {
  try {
    await dbConnect();
    
    // Récupérer les animes tendance (basé sur la popularité et le score)
    const trendingAnimes = await Anime.find({
      score: { $gte: 7.0 }, // Score minimum de 7
      scored_by: { $gte: 10000 } // Au moins 10k votes
    })
    .sort({ 
      popularity: 1,  // Popularité croissante (plus bas = plus populaire)
      score: -1       // Score décroissant
    })
    .limit(limit)
    .lean();

    const transformedAnimes = trendingAnimes.map(anime => transformMongoAnime(anime as any));
    return transformedAnimes;

  } catch (error) {
    console.error('Error fetching trending animes server-side:', error);
    return fallbackAnimes;
  }
}

export async function getTopRatedAnimeServer(limit: number = 20): Promise<AnimeType[]> {
  try {
    await dbConnect();
    
    // Récupérer les animes les mieux notés
    const topRatedAnimes = await Anime.find({
      scored_by: { $gte: 1000 } // Au moins 1000 votes pour être fiable
    })
    .sort({ 
      score: -1,      // Score décroissant
      scored_by: -1   // Nombre de votes décroissant
    })
    .limit(limit)
    .lean();

    const transformedAnimes = topRatedAnimes.map(anime => transformMongoAnime(anime as any));
    return transformedAnimes;

  } catch (error) {
    console.error('Error fetching top rated animes server-side:', error);
    return fallbackAnimes;
  }
}

export async function getNewReleasesServer(limit: number = 20): Promise<AnimeType[]> {
  try {
    await dbConnect();
    
    // Calculer la date il y a 2 ans pour les "nouvelles sorties"
    const twoYearsAgo = new Date().getFullYear() - 2;

    // Récupérer les animes récents (2 dernières années)
    const newReleases = await Anime.find({
      'aired.prop.from.year': { $gte: twoYearsAgo },
      score: { $gte: 6.0 } // Score minimum pour la qualité
    })
    .sort({ 
      'aired.prop.from.year': -1,  // Année décroissante
      'aired.prop.from.month': -1, // Mois décroissant
      'aired.prop.from.day': -1,   // Jour décroissant
      score: -1                    // Score décroissant
    })
    .limit(limit)
    .lean();

    const transformedAnimes = newReleases.map(anime => transformMongoAnime(anime as any));
    return transformedAnimes;

  } catch (error) {
    console.error('Error fetching new releases server-side:', error);
    return fallbackAnimes;
  }
}

export async function getAnimeByGenreServer(genreName: string, limit: number = 20): Promise<AnimeType[]> {
  try {
    await dbConnect();
    
    const animes = await Anime.find({
      'genres.name': { $regex: genreName, $options: 'i' }
    })
    .sort({ 
      score: -1
    })
    .limit(limit)
    .lean();

    const transformedAnimes = animes.map(anime => transformMongoAnime(anime as any));
    return transformedAnimes;

  } catch (error) {
    console.error('Error fetching anime by genre server-side:', error);
    return fallbackAnimes;
  }
}