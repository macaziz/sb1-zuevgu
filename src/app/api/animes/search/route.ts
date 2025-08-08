import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Anime from '@/models/Anime';
import { transformMongoAnime } from '@/types/tmdb';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query) {
      return Response.json({
        results: [],
        page,
        total_pages: 0,
        total_results: 0
      });
    }

    // Construction de la requête de recherche
    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { synopsis: { $regex: query, $options: 'i' } },
        { 'titles.title': { $regex: query, $options: 'i' } },
        { 'genres.name': { $regex: query, $options: 'i' } }
      ]
    };

    // Calcul de l'offset
    const offset = (page - 1) * limit;

    // Exécution de la requête avec tri par pertinence (score)
    const [animes, total] = await Promise.all([
      Anime.find(searchQuery)
        .sort({ 
          score: -1,      // Score décroissant
          popularity: 1   // Popularité croissante
        })
        .skip(offset)
        .limit(limit)
        .lean(),
      Anime.countDocuments(searchQuery)
    ]);

    const transformedAnimes = animes.map(anime => transformMongoAnime(anime as any));

    return Response.json({
      results: transformedAnimes,
      page,
      total_pages: Math.ceil(total / limit),
      total_results: total
    });

  } catch (error) {
    console.error('Error searching animes:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}