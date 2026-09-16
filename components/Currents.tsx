import React, { useState } from 'react';
import { ArrowUpRight, Disc, Film } from 'lucide-react';
import SpotifyNowPlaying from './SpotifyNowPlaying';
import AudioVisualizer from './AudioVisualizer';

const PLAYLIST_DATA: Record<string, string> = {
  '2026-08': '3t7FhD8MzlbHHdOF4FDhUJ',
  '2026-07': '4RtuUnyP9Vee1WlPkdJWrA',
  '2026-06': '2F03LektTK900ejw5ocEXr',
  '2026-05': '0DusL8EhXkhqv4DweHsJG5',
  '2026-04': '45ryalJsUQPdTv8PIlDd3E',
  '2026-03': '37i9dQZF1DWZeKCadgRdKQ',
};

const MOVIE_DATA: Record<string, any> = {
  '2026-08': {
    title: "Vishwanath & Sons",
    year: "2024",
    director: "Venky Atluri",
    genres: ["Drama", "Family"],
    quote: "end of the month",
    letterboxdUrl: "https://letterboxd.com/film/vishwanath-sons/",
    posterId: "15JOjiFfMNo8RLd0TmPaCjiAI_Q-Fz56F"
  },
  '2026-07': {
    title: "Not Without My Daughter",
    year: "1991",
    director: "Brian Gilbert",
    genres: ["Thriller", "Drama"],
    quote: "Betty Mahmoody’s husband took his wife and daughter to meet his family in Iran. He swore they would be safe. They would be happy. They would be free to leave. He lied.",
    letterboxdUrl: "https://letterboxd.com/film/not-without-my-daughter/",
    posterId: "1qgZXYGb6Oc2ZOBGJ9j2fy9EAm282ylN5"
  },
  '2026-06': {
    title: "Barbie in A Mermaid Tale",
    year: "2010",
    director: "Adam Wood",
    genres: ["Animated"],
    quote: "queen of ze waves",
    letterboxdUrl: "https://letterboxd.com/film/barbie-in-a-mermaid-tale/",
    posterId: "https://upload.wikimedia.org/wikipedia/en/a/ad/Barbie_in_A_Mermaid_Tale.jpg"
  },
  '2026-05': {
    title: "Hoppers",
    year: "2026",
    director: "Daniel Chong",
    genres: ["Animated"],
    quote: "🦎",
    letterboxdUrl: "https://letterboxd.com/film/hoppers/",
    posterId: "10zvHBtdgDdmqcO3YcsTys8EnEGt0Xx0R"
  },
  '2026-04': {
    title: "Blended",
    year: "2014",
    director: "Frank Coraci",
    genres: ["Comedy", "Romance"],
    quote: "Are you ready to blend?",
    letterboxdUrl: "https://letterboxd.com/film/blended/",
    posterId: "19G_s6WvG6VW7ZIDRu9w4mf5BvPBMSBEA"
  },
  '2026-03': {
    title: "Challengers",
    year: "2024",
    director: "Luca Guadagnino",
    genres: ["Romance", "Drama"],
    quote: "I'm taking excellent care of my little white boys.",
    letterboxdUrl: "https://letterboxd.com/film/challengers/",
    posterId: "fallback-challengers"
  }
};

const getRecentMonths = (data: Record<string, any>) => {
  const months = [];
  const keys = Object.keys(data).sort((a, b) => b.localeCompare(a));
  
  for (let i = 0; i < 4 && i < keys.length; i++) {
    const key = keys[i];
    const [year, month] = key.split('-');
    const d = new Date(parseInt(year), parseInt(month) - 1, 1);
    const label = d.toLocaleString('default', { month: 'short' }) + " '" + year.slice(2);
    months.push({ key, label });
  }
  return months;
};

const RECENT_PLAYLIST_MONTHS = getRecentMonths(PLAYLIST_DATA);
const RECENT_CINEMA_MONTHS = getRecentMonths(MOVIE_DATA);

const Currents: React.FC = () => {
  const [selectedPlaylistMonth, setSelectedPlaylistMonth] = useState(RECENT_PLAYLIST_MONTHS[0]?.key || '2026-07');
  const [selectedCinemaMonth, setSelectedCinemaMonth] = useState(RECENT_CINEMA_MONTHS[0]?.key || '2026-07');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const activePlaylistId = PLAYLIST_DATA[selectedPlaylistMonth] || '4RtuUnyP9Vee1WlPkdJWrA';
  const activeMovie = MOVIE_DATA[selectedCinemaMonth] || MOVIE_DATA['2026-07'];

  const hasError = failedImages[activeMovie.posterId] || activeMovie.posterId.startsWith('fallback');
  const posterSrc = hasError 
      ? 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop'
      : activeMovie.posterId.startsWith('http')
          ? activeMovie.posterId
          : `https://drive.google.com/thumbnail?id=${activeMovie.posterId}&sz=w1000`;

  const handleImageError = () => {
    setFailedImages(prev => ({ ...prev, [activeMovie.posterId]: true }));
  };

  return (
    <section id="currents" className="flex flex-col bg-bg border-t border-fg">
      {/* Top Features Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-fg">
        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-fg flex flex-col justify-center">
            <AudioVisualizer 
                src="/song.mp3" 
                title="RAYJEW - RAW BEAT .MP3"
            />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
            <SpotifyNowPlaying />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
      {/* Listening */}
      <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-fg flex flex-col">
         <div className="flex justify-between items-baseline mb-8 border-b border-fg pb-4">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Disc className="animate-[spin_8s_linear_infinite]" size={24} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-bg rounded-full border border-fg"></div>
                    </div>
                </div>
                <h3 className="font-serif text-3xl italic">Heavy Rotation</h3>
            </div>
            <select 
                value={selectedPlaylistMonth}
                onChange={(e) => setSelectedPlaylistMonth(e.target.value)}
                className="font-mono text-xs uppercase tracking-widest bg-fg text-bg px-2 py-1 font-bold cursor-pointer outline-none hover:bg-fg/90 transition-colors"
            >
                {RECENT_PLAYLIST_MONTHS.map((p) => (
                    <option key={p.key} value={p.key} className="bg-bg text-fg font-bold">
                        {p.label}
                    </option>
                ))}
            </select>
         </div>
         
         <div className="flex-1 border border-fg p-1 bg-fg/5 shadow-[12px_12px_0px_0px_var(--fg)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[10px_10px_0px_0px_var(--fg)] transition-all">
            <iframe 
              src={`https://open.spotify.com/embed/playlist/${activePlaylistId}?utm_source=generator&theme=0`}
              height="100%" 
              style={{ minHeight: '380px' }}
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500 block"
            ></iframe>
         </div>
      </div>

      {/* Watching */}
      <div className="p-8 md:p-12 flex flex-col">
         <div className="flex justify-between items-baseline mb-8 border-b border-fg pb-4">
             <div className="flex items-center gap-3">
                <Film size={24} />
                <h3 className="font-serif text-3xl italic">Cinema Club</h3>
            </div>
            <select 
                value={selectedCinemaMonth}
                onChange={(e) => setSelectedCinemaMonth(e.target.value)}
                className="font-mono text-xs uppercase tracking-widest bg-fg text-bg px-2 py-1 font-bold cursor-pointer outline-none hover:bg-fg/90 transition-colors"
            >
                {RECENT_CINEMA_MONTHS.map((p) => (
                    <option key={p.key} value={p.key} className="bg-bg text-fg font-bold">
                        {p.label}
                    </option>
                ))}
            </select>
         </div>

        <div className="flex-1 flex flex-col xl:flex-row gap-8">
            {/* Poster */}
            <div className="relative group w-full xl:w-1/2 aspect-[2/3] border-2 border-fg overflow-hidden shadow-[12px_12px_0px_0px_var(--fg)] bg-fg/10">
                <img
                    src={posterSrc}
                    alt="Movie Poster"
                    onError={handleImageError}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                />
                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 bg-fg text-bg px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest z-10">
                    {hasError ? 'PREVIEW MODE' : 'Last Watched'}
                </div>
                {hasError && (
                  <div className="absolute bottom-4 left-4 right-4 bg-bg/90 border border-fg p-2 font-mono text-[10px] uppercase text-center">
                    Remote asset failed. Using failsafe.
                  </div>
                )}
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                    <h4 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-none">{activeMovie.title}</h4>
                    <div className="flex flex-wrap gap-2 font-mono text-xs mb-6">
                        <span className="border border-fg px-2 py-1">{activeMovie.year}</span>
                        <span className="border border-fg px-2 py-1">{activeMovie.director}</span>
                        {activeMovie.genres.map((g: string) => (
                            <span key={g} className="border border-fg px-2 py-1">{g}</span>
                        ))}
                    </div>
                    <p className="font-mono text-sm leading-7 opacity-80 border-l-2 border-fg pl-4 italic">
                        "{activeMovie.quote}"
                    </p>
                </div>
                
                <a 
                  href={activeMovie.letterboxdUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 font-mono text-sm uppercase font-bold hover:bg-fg hover:text-bg w-full md:w-fit px-6 py-4 border border-fg transition-all mt-8 shadow-[4px_4px_0px_0px_var(--fg)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                   View Details <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
            </div>
         </div>
      </div>
      </div>
    </section>
  );
};

export default Currents;