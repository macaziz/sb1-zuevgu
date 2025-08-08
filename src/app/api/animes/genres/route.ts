import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Anime from '@/models/Anime';

export async function GET(request: NextRequest) {
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
          id: '$_id',        // Mapper mal_id vers id pour la compatibilité
          mal_id: '$_id',    // Garder mal_id aussi
          name: 1,
          type: 1,
          url: 1,
          count: 1,
          _id: 0
        }
      }
    ]);

    return Response.json({
      genres: genres
    });

  } catch (error) {
    console.error('Error fetching genres:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}