import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Github, Linkedin } from 'lucide-react';

const SKILLS_MARQUEE = [
  "React", "TypeScript", "Python", "FastAPI", "Java", "C++", "C", "SQL", "Node.js", "Angular",
  "ShadCN UI", "Tailwind CSS", "Git", "VS Code", "Visual Studio", "REST APIs", "GraphQL",
  "API Design", "AI/ML", "GANs", "PostgreSQL", "MySQL", "Data Preprocessing", "NLP",
  "Generative AI", "PyTorch", "TensorFlow", "Computer Vision", "Cloud-Native", "LLMs"
];

// Configuration for Random Styles
const FONTS = ['font-serif', 'font-mono', 'font-sans'];
const COLORS = [
  'text-fg', 
  'text-accent',
  'text-red-600', 
  'text-blue-600', 
  'text-yellow-500', 
  'text-purple-600', 
  'text-green-600', 
  'text-pink-600'
];
// Sizes tailored to look chaotic but stay roughly within bounds of the hero
const SIZES = [
  'text-5xl md:text-7xl', 
  'text-6xl md:text-8xl', 
  'text-7xl md:text-9xl', 
  'text-8xl md:text-[10rem]', 
  'text-9xl md:text-[12rem]'
];

interface LetterStyle {
  font: string;
  color: string;
  size: string;
  rotate: number;
}

const Hero: React.FC = () => {
  // We track the style of each character by its index
  // 0-4 = ARNAV, 5-8 = RAJU
  const [letterStyles, setLetterStyles] = useState<Record<number, LetterStyle>>({});

  const generateRandomStyle = (): LetterStyle => ({
    font: FONTS[Math.floor(Math.random() * FONTS.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: SIZES[Math.floor(Math.random() * SIZES.length)],
    rotate: Math.floor(Math.random() * 20) - 10, // -10deg to 10deg tilt
  });

  const handleLetterClick = (index: number) => {
    setLetterStyles(prev => ({
      ...prev,
      [index]: generateRandomStyle()
    }));
  };

  const handleRandomizeAll = () => {
    const newStyles: Record<number, LetterStyle> = {};
    // "ARNAV" (5) + "RAJU" (4) = 9 characters total
    for (let i = 0; i < 9; i++) {
      newStyles[i] = generateRandomStyle();
    }
    setLetterStyles(newStyles);
  };

  const renderWord = (word: string, startIndex: number) => {
    return word.split('').map((char, i) => {
      const globalIndex = startIndex + i;
      const style = letterStyles[globalIndex];

      return (
        <motion.span
          key={globalIndex}
          onClick={() => handleLetterClick(globalIndex)}
          className={`
            inline-block cursor-pointer select-none transition-colors duration-200
            ${style ? style.font : 'font-serif'}
            ${style ? style.color : 'text-fg'}
            ${style ? style.size : 'text-7xl md:text-[10rem]'}
          `}
          animate={{ 
            rotate: style ? style.rotate : 0,
            y: style ? (Math.random() * 20 - 10) : 0 
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {char}
        </motion.span>
      );
    });
  };

  return (
    <section className="min-h-[85vh] flex flex-col justify-between relative overflow-hidden">
      
      {/* Rotating Badge / Social Hub */}
      <div className="absolute top-8 right-8 md:top-12 md:right-12 z-20 hidden md:block group">
        <div className="w-32 h-32 rounded-full border border-fg flex items-center justify-center relative bg-bg hover:bg-accent transition-colors duration-500">
            
            {/* Rotating Text Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none group-hover:opacity-10 opacity-100 transition-opacity"
            >
              <svg className="w-full h-full" viewBox="0 0 100 100">
                 <path id="curve" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent" />
                 <text className="text-[10px] font-mono uppercase fill-current text-fg tracking-[0.2em]">
                   <textPath href="#curve">
                     •  Engineer Portfolio •  2026 
                   </textPath>
                 </text>
              </svg>
            </motion.div>

            {/* Center Dot (Default) */}
            <div className="w-2 h-2 bg-accent rounded-full absolute group-hover:scale-0 transition-transform duration-300"></div>

            {/* Social Icons Grid (Hover) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="grid grid-cols-2 gap-4">
                    <a 
                      href="https://github.com/Arnav-Raju" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-bg hover:scale-110 transition-transform p-1"
                      title="GitHub"
                    >
                        <Github size={20} />
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/arnav-penumetcha/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-bg hover:scale-110 transition-transform p-1"
                      title="LinkedIn"
                    >
                        <Linkedin size={20} />
                    </a>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 flex flex-col items-center"
        >
          {/* Header Controls */}
          <div className="flex items-center gap-4 mb-4">
            <div className="group inline-block border border-accent bg-accent/5 px-4 py-1.5 rounded-full hover:bg-accent transition-colors cursor-default">
               <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold group-hover:text-bg transition-colors">Available for hire</span>
            </div>
            <button 
              onClick={handleRandomizeAll}
              className="p-1.5 border border-fg rounded-full hover:bg-accent hover:text-bg hover:border-accent transition-colors"
              title="Randomize Title Style"
            >
              <Shuffle size={14} />
            </button>
          </div>
          
          {/* Interactive Title */}
          <div className="flex flex-col items-center gap-2 md:gap-4 leading-[0.85] mix-blend-difference w-full">
            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
              {renderWord("ARNAV", 0)}
            </div>
            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
              {renderWord("RAJU", 5)}
            </div>
          </div>
          
          <p className="font-mono text-sm md:text-lg max-w-xl leading-relaxed pt-8 opacity-80 text-center">
            Software Engineer specializing in <span className="underline decoration-1 underline-offset-4 decoration-accent/60">AI/ML architectures</span> and <span className="underline decoration-1 underline-offset-4 decoration-accent/60">full-stack applications</span>.
          </p>
        </motion.div>
      </div>

      {/* Infinite Marquee Footer */}
      <div className="border-t border-fg py-4 overflow-hidden bg-bg text-fg">
        <div className="marquee-container flex">
          {/* Render the list twice to create a seamless loop */}
          <div className="marquee-content font-mono text-xs md:text-sm font-bold uppercase tracking-[0.3em] flex gap-12 px-6">
            {SKILLS_MARQUEE.map((skill, i) => (
              <span key={`1-${i}`} className={`whitespace-nowrap ${i % 3 === 0 ? 'text-accent' : ''}`}>{skill}</span>
            ))}
          </div>
          <div className="marquee-content font-mono text-xs md:text-sm font-bold uppercase tracking-[0.3em] flex gap-12 px-6" aria-hidden="true">
            {SKILLS_MARQUEE.map((skill, i) => (
              <span key={`2-${i}`} className={`whitespace-nowrap ${i % 3 === 0 ? 'text-accent' : ''}`}>{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;