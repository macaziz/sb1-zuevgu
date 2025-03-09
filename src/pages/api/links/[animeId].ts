import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import { Link } from '@/models/Link';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const { animeId } = req.query;

    const links = await Link.findOne({ animeId: Number(animeId) });
    
    if (!links) {
      return res.status(404).json({ message: 'Links not found' });
    }

    return res.status(200).json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 