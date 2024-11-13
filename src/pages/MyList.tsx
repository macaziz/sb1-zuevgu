import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWatchlist } from '../contexts/WatchlistContext';
import { Trash2 } from 'lucide-react';

export default function MyList() {
  const { user } = useAuth();
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Ma Liste</h1>

      {!user && (
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">Veuillez vous connecter pour voir votre liste</p>
          <Link
            to="/login"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      )}

      {user && watchlist.length === 0 && (
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">Votre liste est vide</p>
          <Link
            to="/"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Parcourir les Animes
          </Link>
        </div>
      )}

      {user && watchlist.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {watchlist.map((item) => (
            <div key={item.animeId} className="bg-gray-900 rounded-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full aspect-video object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.genres.join(", ")}</p>
                <div className="space-y-2">
                  <Link
                    to={`/anime/${item.animeId}`}
                    className="block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-center"
                  >
                    Voir les détails
                  </Link>
                  <button
                    onClick={() => removeFromWatchlist(item.animeId)}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}