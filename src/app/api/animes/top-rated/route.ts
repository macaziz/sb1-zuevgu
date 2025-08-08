import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Anime from '@/models/Anime';
import { transformMongoAnime } from '@/types/tmdb';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');

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

    return Response.json({
      results: transformedAnimes,
      total: transformedAnimes.length
    });

  } catch (error) {
    console.error('Error fetching top rated animes:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}