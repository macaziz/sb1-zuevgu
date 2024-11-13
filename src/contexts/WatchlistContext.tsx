"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface WatchlistItem {
  animeId: number;
  title: string;
  image: string;
  genres: string[];
  addedAt: string;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (anime: Omit<WatchlistItem, 'addedAt'>) => void;
  removeFromWatchlist: (animeId: number) => void;
  isInWatchlist: (animeId: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`watchlist_${user.id}`);
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } else {
      setWatchlist([]);
    }
  }, [user]);

  const addToWatchlist = (anime: Omit<WatchlistItem, 'addedAt'>) => {
    if (!user) return;

    const newWatchlist = [
      ...watchlist,
      { ...anime, addedAt: new Date().toISOString() }
    ];
    setWatchlist(newWatchlist);
    localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(newWatchlist));
  };

  const removeFromWatchlist = (animeId: number) => {
    if (!user) return;

    const newWatchlist = watchlist.filter(item => item.animeId !== animeId);
    setWatchlist(newWatchlist);
    localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(newWatchlist));
  };

  const isInWatchlist = (animeId: number) => {
    return watchlist.some(item => item.animeId === animeId);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}