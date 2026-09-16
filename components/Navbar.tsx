import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Clock, Sun, Moon, Terminal, Aperture, Command, Zap, Settings2 } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '../types';

interface NavbarProps {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTheme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeedrunning, setIsSpeedrunning] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSpeedrun = async () => {
    if (isSpeedrunning) return;
    setIsSpeedrunning(true);
    
    const elements = NAV_LINKS.map(link => document.querySelector(link.href));
    
    for (const el of elements) {
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        // Visual feedback
        el.classList.add('ring-4', 'ring-fg', 'ring-opacity-20');
        await new Promise(r => setTimeout(r, 2000));
        el.classList.remove('ring-4', 'ring-fg', 'ring-opacity-20');
      }
    }
    
    scrollToTop();
    setIsSpeedrunning(false);
  };

  const themes = [
    { id: Theme.LIGHT, icon: <Sun size={18} />, label: 'Light' },
    { id: Theme.DARK, icon: <Moon size={18} />, label: 'Dark' },
    { id: Theme.RGB, icon: <Terminal size={18} />, label: 'RGB' },
    { id: Theme.VIBE, icon: <Aperture size={18} />, label: 'Vibe' },
    { id: Theme.CUSTOM, icon: <Settings2 size={18} />, label: 'Themer' },
  ];

  const handleThemeCycle = () => {
    const currentIndex = themes.findIndex(t => t.id === currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    
    // Logic moved to parent to handle the 'click while active' trigger for the modal
    const event = new CustomEvent('cycle-theme');
    window.dispatchEvent(event);
    
    // We still update here for simple state, but App.tsx handles the modal trigger
    setTheme(themes[nextIndex].id);
  };

  const currentThemeObj = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <nav className="sticky top-0 z-50 bg-bg border-b border-fg transition-colors duration-300">
      <div className="flex flex-col lg:flex-row">
        
        {/* Logo Section */}
        <div className="flex justify-between items-center h-14 border-b lg:border-b-0 lg:border-r border-fg w-full lg:w-auto lg:px-8 px-4 shrink-0">
          <button 
            onClick={scrollToTop}
            className="text-lg font-serif font-bold tracking-tight hover:italic transition-all uppercase"
          >
            Arnav.Dev_
          </button>
          
          <div className="flex gap-2 lg:hidden">
            <button
              onClick={handleSpeedrun}
              className={`p-1 w-8 h-8 flex items-center justify-center border border-fg transition-all ${isSpeedrunning ? 'bg-fg text-bg animate-pulse' : ''}`}
              title="Start Speedrun"
            >
              <Zap size={14} />
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 w-8 h-8 flex items-center justify-center border border-fg hover-invert"
            >
              {isOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* System Status (Desktop) */}
        <div className="hidden lg:flex w-auto border-r border-fg items-center justify-between px-6 h-14 font-mono text-xs whitespace-nowrap shrink-0">
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <Globe size={12} className="animate-pulse" />
               <span>ONLINE</span>
             </div>
             <button
              onClick={handleSpeedrun}
              className={`flex items-center gap-2 px-2 py-1 border border-fg transition-all hover:bg-fg hover:text-bg ${isSpeedrunning ? 'bg-fg text-bg' : ''}`}
             >
                <Zap size={12} className={isSpeedrunning ? 'animate-bounce' : ''} />
                <span className="text-[10px] uppercase font-bold tracking-tighter">Speedrun</span>
             </button>
           </div>
        </div>

        {/* Desktop Links Grid */}
        <div className="hidden lg:flex flex-1 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {NAV_LINKS.map(link => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="flex-auto flex items-center justify-center border-r border-fg text-xs font-mono uppercase tracking-wider hover-invert transition-all last:border-r-0 h-14 px-3 xl:px-4 whitespace-nowrap"
            >
              {link.name}
            </a>
          ))}
          
          <div className="w-auto flex border-l border-fg shrink-0">
              <button
                onClick={handleThemeCycle}
                className={`w-14 flex items-center justify-center hover-invert transition-all h-14 ${currentTheme === Theme.CUSTOM ? 'bg-fg text-bg animate-pulse' : ''}`}
                title={`Current Theme: ${currentThemeObj.label}. Click to cycle.`}
              >
                {currentThemeObj.icon}
              </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-b border-fg overflow-hidden"
        >
          <div className="flex flex-col">
            <div className="flex justify-between p-4 border-b border-fg font-mono text-xs bg-fg/5">
               <span>STATUS: ONLINE</span>
            </div>
            {NAV_LINKS.map(link => (
              <a 
                key={link.name} 
                href={link.href}
                className="py-4 px-4 border-b border-fg last:border-b-0 font-serif text-xl hover-invert"
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;