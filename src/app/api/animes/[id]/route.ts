import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Anime from '@/models/Anime';
import { transformMongoAnime } from '@/types/tmdb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const animeId = parseInt(params.id);
    
    if (isNaN(animeId)) {
      return Response.json(
        { message: 'Invalid anime ID' },
        { status: 400 }
      );
    }

    // Récupérer l'anime principal
    const anime = await Anime.findOne({ mal_id: animeId }).lean();
    
    if (!anime) {
      return Response.json(
        { message: 'Anime not found' },
        { status: 404 }
      );
    }

    // Récupérer les recommandations basées sur les genres similaires
    const genreIds = (anime as any).genres.map((g: any) => g.mal_id);
    const recommendations = await Anime.find({
      mal_id: { $ne: animeId },
      'genres.mal_id': { $in: genreIds }
    })
    .sort({ score: -1 })
    .limit(8)
    .lean();

    // Transformer les données
    const transformedAnime = transformMongoAnime(anime as any);
    const transformedRecommendations = recommendations.map(rec => transformMongoAnime(rec as any));

    // Construire la réponse avec le format AnimeDetails
    const animeDetails = {
      ...transformedAnime,
      numberOfSeasons: (anime as any).relations?.filter((r: any) => r.type === 'sequel' || r.type === 'prequel').length || 1,
      seasons: [], // Pas de données de saisons dans MongoDB pour l'instant
      recommendations: transformedRecommendations,
      nextEpisodeDate: null,
      episodes_data: (anime as any).episodes_data,
      relations: (anime as any).relations
    };

    return Response.json(animeDetails);

  } catch (error) {
    console.error('Error fetching anime details:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}