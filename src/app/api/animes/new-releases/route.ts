import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Anime from '@/models/Anime';
import { transformMongoAnime } from '@/types/tmdb';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');

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

    return Response.json({
      results: transformedAnimes,
      total: transformedAnimes.length
    });

  } catch (error) {
    console.error('Error fetching new releases:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}