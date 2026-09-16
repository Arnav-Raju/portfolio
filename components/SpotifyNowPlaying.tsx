import React, { useEffect, useState } from 'react';
import { Music, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface NowPlayingData {
  album?: string;
  albumImageUrl?: string;
  artist?: string;
  isPlaying: boolean;
  songUrl?: string;
  title?: string;
  error?: string;
}

const SpotifyNowPlaying: React.FC = () => {
  const [data, setData] = useState<NowPlayingData>({ isPlaying: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/now');
        const nowPlaying = await response.json();
        setData(nowPlaying);
      } catch (e) {
        console.error('Error fetching Spotify data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
    // Poll every 30 seconds
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-24 border border-fg bg-bg flex items-center justify-center">
        <div className="flex items-center gap-2 font-mono text-xs opacity-50 uppercase tracking-widest">
          <Music size={14} className="animate-pulse" /> Loading Signal...
        </div>
      </div>
    );
  }

  if (data.error === 'Credentials not configured') {
    return (
      <div className="w-full p-4 border border-fg bg-bg/50 shadow-[4px_4px_0px_0px_var(--fg)] flex flex-col gap-2">
        <div className="flex items-center gap-2 font-mono text-xs uppercase font-bold text-accent">
          <AlertCircle size={14} /> Setup Required
        </div>
        <p className="font-mono text-[10px] leading-relaxed">
          Spotify Now Playing requires API keys. Add <span className="bg-fg text-bg px-1">SPOTIFY_CLIENT_ID</span>, <span className="bg-fg text-bg px-1">SPOTIFY_CLIENT_SECRET</span>, and <span className="bg-fg text-bg px-1">SPOTIFY_REFRESH_TOKEN</span> to your environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full border border-fg bg-bg p-4 shadow-[4px_4px_0px_0px_var(--fg)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
      <div className="flex items-center gap-2 mb-3 border-b border-fg/20 pb-2">
        <Music size={14} className={data.isPlaying ? 'text-accent animate-bounce' : 'opacity-50'} />
        <h4 className="font-mono text-[10px] uppercase tracking-widest font-bold">
          {data.isPlaying ? 'Currently Listening' : 'Recently Played (Offline)'}
        </h4>
      </div>

      {data.songUrl ? (
        <a 
          href={data.songUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-4 group"
        >
          {data.albumImageUrl && (
            <div className="w-16 h-16 shrink-0 border border-fg overflow-hidden">
              <img 
                src={data.albumImageUrl} 
                alt={data.album || 'Album Art'} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-serif text-lg md:text-xl font-bold truncate group-hover:italic group-hover:text-accent transition-colors">
              {data.title}
            </span>
            <span className="font-mono text-xs opacity-70 truncate mt-1">
              {data.artist}
            </span>
          </div>
        </a>
      ) : (
        <div className="flex items-center gap-4 opacity-60">
          <div className="w-16 h-16 shrink-0 border border-fg flex items-center justify-center bg-fg/5">
            <Music size={24} className="opacity-20" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold">Silence.</span>
            <span className="font-mono text-xs mt-1">Not playing anything right now.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotifyNowPlaying;
