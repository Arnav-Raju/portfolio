
import React from 'react';
import ScrambleText from './ScrambleText';
import { motion } from 'framer-motion';
import { MUSIC_ARTICLES, DISCOGRAPHY, ARTIST_PROFILE } from '../constants';
import LinkPreview from './LinkPreview';
import { Disc, Newspaper, AudioWaveform, ArrowUpRight } from 'lucide-react';

const Music: React.FC = () => {
  return (
    <section id="music" className="bg-bg">
      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-fg">
        <div className="p-8 border-b md:border-b-0 md:border-r border-fg flex items-center">
            <h2 className="text-3xl font-serif italic"><ScrambleText text="Artist Persona" /></h2>
        </div>
        <div className="md:col-span-3 p-8 flex items-center justify-between">
             <div className="flex flex-col md:flex-row gap-4 md:items-baseline">
                <span className="font-mono text-xl font-bold tracking-tight">RAYJEW</span>
                <a href={ARTIST_PROFILE} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-mono text-xs hover:bg-fg hover:text-bg px-2 py-1 border border-fg transition-colors uppercase w-fit">
                    Spotify Profile <ArrowUpRight size={10} />
                </a>
             </div>
             <span className="font-mono text-xs uppercase tracking-widest opacity-50">Experimental / Hip-Hop</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Discography Col */}
        <div className="border-b md:border-b-0 md:border-r border-fg p-8">
            <div className="flex items-center gap-2 mb-8 border-b border-fg pb-2">
                <Disc size={20} />
                <h3 className="font-mono text-sm font-bold uppercase">Selected Discography</h3>
            </div>
            
            <div className="space-y-6">
                {DISCOGRAPHY.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="group flex flex-col gap-1 border-b border-fg/20 pb-4 last:border-b-0">
                        <h4 className="font-serif text-xl">{item.title}</h4>
                        <div className="flex justify-between items-end">
                             <span className="font-mono text-xs opacity-60">{item.role}</span>
                             <a href={item.link} target="_blank" rel="noreferrer" className="font-mono text-[10px] bg-fg text-bg px-2 py-1 hover:opacity-80 transition-opacity">
                                STREAM
                             </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Latest Release / Player Col (Middle) */}
        <div className="border-b md:border-b-0 md:border-r border-fg p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-8 border-b border-fg pb-2">
                <AudioWaveform size={20} />
                <h3 className="font-mono text-sm font-bold uppercase">Latest Release</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full h-[380px] bg-fg/5 border border-fg p-1 shadow-[8px_8px_0px_0px_var(--fg)]">
                   <iframe 
                        style={{ borderRadius: '0px' }} 
                        src="https://open.spotify.com/embed/album/13fx5aXgbzWQG05PQ4HM0v?utm_source=generator&si=b31e8d69f537497d" 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        allowFullScreen 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                        className="grayscale hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                </div>
            </div>
        </div>

        {/* Press Col */}
        <div className="p-8">
            <div className="flex items-center gap-2 mb-8 border-b border-fg pb-2">
                <Newspaper size={20} />
                <h3 className="font-mono text-sm font-bold uppercase">Press & Features</h3>
            </div>
            <div className="space-y-6">
                {MUSIC_ARTICLES.map((article, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col gap-1"
                    >
                        <span className="font-mono text-[10px] uppercase opacity-50">{article.publication}</span>
                        <LinkPreview 
                            href={article.url} 
                            previewImage={article.image}
                            className="font-serif text-lg leading-snug border-b border-transparent hover:border-fg w-fit"
                        >
                            {article.title}
                        </LinkPreview>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Music;
