"use client";

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface EpisodeCountdownProps {
  nextEpisodeDate: string;
}

export default function EpisodeCountdown({ nextEpisodeDate }: EpisodeCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(nextEpisodeDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [nextEpisodeDate]);

  if (!timeLeft) {
    return null;
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Clock className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-white">Prochain épisode dans :</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">{timeLeft.days}</div>
          <div className="text-sm text-gray-400">Jours</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">{timeLeft.hours}</div>
          <div className="text-sm text-gray-400">Heures</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">{timeLeft.minutes}</div>
          <div className="text-sm text-gray-400">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">{timeLeft.seconds}</div>
          <div className="text-sm text-gray-400">Secondes</div>
        </div>
      </div>
    </div>
  );
}