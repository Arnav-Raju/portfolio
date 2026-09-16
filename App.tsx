import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Music from './components/Music';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import Skills from './components/Skills';
import Fun from './components/Fun';
import Contact from './components/Contact';
import Guestbook from './components/Guestbook';

import ScrollRobot from './components/ScrollRobot';
import Currents from './components/Currents';
import CustomCursor from './components/CustomCursor';
import CommandPalette from './components/CommandPalette';
import Themer from './components/Themer';
import WireframeBackground from './components/WireframeBackground';

import { Theme, CustomThemeConfig } from './types';

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(Theme.LIGHT);
  const [isThemerOpen, setIsThemerOpen] = useState(false);
  const [customConfig, setCustomConfig] = useState<CustomThemeConfig>({
    primaryColor: '#ffffff',
    secondaryColor: '#000000',
    tertiaryColor: '#470ff4',
    primaryFont: "'Space Mono', monospace",
    secondaryFont: "'Playfair Display', serif",
    tertiaryFont: "'Space Mono', monospace"
  });

  useEffect(() => {
    // Initial Load
    const storedTheme = localStorage.getItem('theme') as Theme;
    const storedConfig = localStorage.getItem('customThemeConfig');
    
    if (storedConfig) {
      setCustomConfig(JSON.parse(storedConfig));
    }

    if (Object.values(Theme).includes(storedTheme)) {
      setTheme(storedTheme);
    } else {
      setTheme(Theme.LIGHT);
    }
  }, []);

  useEffect(() => {
    if (currentTheme === Theme.CUSTOM) {
      applyCustomStyles(customConfig);
    }
  }, [currentTheme, customConfig]);

  const applyCustomStyles = (config: CustomThemeConfig) => {
    const root = document.documentElement;
    root.style.setProperty('--bg', config.primaryColor);
    root.style.setProperty('--fg', config.secondaryColor);
    root.style.setProperty('--accent', config.tertiaryColor);
    
    document.body.style.fontFamily = config.primaryFont;
    
    root.style.setProperty('--font-primary', config.primaryFont);
    root.style.setProperty('--font-secondary', config.secondaryFont);
    root.style.setProperty('--font-tertiary', config.tertiaryFont);

    let styleTag = document.getElementById('dynamic-fonts');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-fonts';
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
      .font-serif { font-family: ${config.secondaryFont} !important; }
      .font-mono { font-family: ${config.primaryFont} !important; }
      .font-sans { font-family: ${config.tertiaryFont} !important; }
      
      /* Make tertiary color pop more in custom theme */
      .theme-custom .bg-accent { background-color: var(--accent) !important; }
      .theme-custom .text-accent { color: var(--accent) !important; }
      .theme-custom .border-accent { border-color: var(--accent) !important; }
      .theme-custom .shadow-accent { box-shadow: 8px 8px 0px 0px var(--accent) !important; }
    `;
  };

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    
    document.documentElement.className = 'scroll-smooth';
    
    if (theme !== Theme.CUSTOM) {
      document.documentElement.removeAttribute('style');
      document.body.style.fontFamily = '';
      const styleTag = document.getElementById('dynamic-fonts');
      if (styleTag) styleTag.remove();
    }
    
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else if (theme === Theme.RGB) {
      document.documentElement.classList.add('theme-rgb');
    } else if (theme === Theme.VIBE) {
      document.documentElement.classList.add('theme-vibe');
    } else if (theme === Theme.CUSTOM) {
      document.documentElement.classList.add('theme-custom');
      setIsThemerOpen(true);
    }
  };

  const handleCycleTheme = () => {
    const themes = [Theme.LIGHT, Theme.DARK, Theme.RGB, Theme.VIBE, Theme.CUSTOM];
    
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    
    if (currentTheme === Theme.CUSTOM) {
        setIsThemerOpen(true);
    } else {
        setTheme(themes[nextIndex]);
    }
  };

  const updateCustomConfig = (newConfig: CustomThemeConfig) => {
    setCustomConfig(newConfig);
    localStorage.setItem('customThemeConfig', JSON.stringify(newConfig));
  };

  return (
    <div className="min-h-screen bg-bg text-fg p-2 md:p-4 transition-colors duration-300 relative overflow-hidden">
      <WireframeBackground />
      <CustomCursor />
      <CommandPalette onCycleTheme={handleCycleTheme} />
      
      <div className="border border-fg relative min-h-[95vh] z-10 backdrop-blur-[1px]">
        <Navbar currentTheme={currentTheme} setTheme={setTheme} />
        <ScrollRobot />
        <main className="relative">
          <Hero />
          <div className="border-t border-fg">
            <About />
          </div>
          <div className="border-t border-fg">
            <Experience />
          </div>
          <div className="border-t border-fg">
            <Certifications />
          </div>
          <div className="border-t border-fg">
            <Projects />
          </div>
          <div className="border-t border-fg">
            <Skills />
          </div>
          <div className="border-t border-fg">
            <Music />
          </div>
          <div className="border-t border-fg">
            <Currents />
          </div>
          <div className="border-t border-fg">
            <Fun />
          </div>
          <Guestbook />
          <div className="border-t border-fg">
            <Contact />
          </div>
        </main>
      </div>

      <Themer 
        isOpen={isThemerOpen} 
        onClose={() => setIsThemerOpen(false)} 
        config={customConfig}
        onUpdate={updateCustomConfig}
      />
    </div>
  );
};

export default App;