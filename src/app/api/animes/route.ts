import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Anime from '@/models/Anime';
import { transformMongoAnime } from '@/types/tmdb';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const genre = searchParams.get('genre');
    const genres = searchParams.get('genres'); // Support pour les IDs multiples
    const year = searchParams.get('year');
    const sortBy = searchParams.get('sortBy') || 'popularity';
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    // Construction de la requête
    const query: any = {};

    // Recherche textuelle
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { synopsis: { $regex: search, $options: 'i' } },
        { 'titles.title': { $regex: search, $options: 'i' } }
      ];
    }

    // Filtrage par genre (nom)
    if (genre) {
      query['genres.name'] = { $regex: genre, $options: 'i' };
    }

    // Filtrage par genres (IDs multiples)
    if (genres) {
      try {
        const genreIds = genres.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        if (genreIds.length > 0) {
          query['genres.mal_id'] = { $in: genreIds };
        }
      } catch (error) {
        console.error('Error parsing genre IDs:', error);
      }
    }

    // Filtrage par année
    if (year) {
      query['aired.prop.from.year'] = parseInt(year);
    }

    // Filtrage par statut
    if (status) {
      query.status = status;
    }

    // Filtrage par type
    if (type) {
      query.type = type;
    }

    // Options de tri
    let sortOptions: any = {};
    switch (sortBy) {
      case 'score':
        sortOptions = { score: -1 };
        break;
      case 'popularity':
        sortOptions = { popularity: 1 };
        break;
      case 'title':
        sortOptions = { title: 1 };
        break;
      case 'episodes':
        sortOptions = { episodes: -1 };
        break;
      case 'year':
        sortOptions = { 'aired.prop.from.year': -1 };
        break;
      default:
        sortOptions = { popularity: 1 };
    }

    // Calcul de l'offset
    const offset = (page - 1) * limit;

    // Exécution de la requête
    const [animes, total] = await Promise.all([
      Anime.find(query)
        .sort(sortOptions)
        .skip(offset)
        .limit(limit)
        .lean(),
      Anime.countDocuments(query)
    ]);

    // Transformation des données
    const transformedAnimes = animes.map(anime => transformMongoAnime(anime as any));

    return Response.json({
      results: transformedAnimes,
      page,
      total_pages: Math.ceil(total / limit),
      total_results: total
    });

  } catch (error) {
    console.error('Error fetching animes:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}