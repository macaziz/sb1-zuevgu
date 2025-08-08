import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Link } from '@/models/Link';

export async function GET(
  request: NextRequest,
  { params }: { params: { animeId: string } }
) {
  try {
    await dbConnect();
    const animeId = params.animeId;

    const links = await Link.findOne({ animeId: Number(animeId) });
    
    if (!links) {
      return Response.json({ message: 'Links not found' }, { status: 404 });
    }

    return Response.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
} 