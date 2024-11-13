import React from 'react';
import { useParams } from 'react-router-dom';
import { useAnimeDetails } from '../hooks/useAnime';
import { Loader } from 'lucide-react';
import AnimeDetail from '../components/AnimeDetail';

export default function AnimeDetails() {
  const { id } = useParams();
  const { anime, isLoading, error } = useAnimeDetails(Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load anime details</p>
      </div>
    );
  }

  return <AnimeDetail anime={anime} />;
}