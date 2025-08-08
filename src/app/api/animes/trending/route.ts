import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Anime from '@/models/Anime';
import { transformMongoAnime } from '@/types/tmdb';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');

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

    return Response.json({
      results: transformedAnimes,
      total: transformedAnimes.length
    });

  } catch (error) {
    console.error('Error fetching trending animes:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}