import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ScrambleText from './ScrambleText';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Cpu, ChevronRight } from 'lucide-react';
import { SKILLS_DATA } from '../constants';
import { SkillCategory, SkillItem } from '../types';

/**
 * Optimized BinaryRainCanvas that handles hover states smoothly.
 * Re-engineered to precisely fill the parent container with high-DPI support.
 */
const BinaryRainCanvas: React.FC<{ isHovered: boolean }> = ({ isHovered }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredRef = useRef(isHovered);
  const dropsRef = useRef<number[]>([]);

  useEffect(() => {
    hoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = 12;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        const width = parent.offsetWidth;
        const height = parent.offsetHeight;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // Recalculate column count based on current width
        const columns = Math.ceil(width / fontSize);
        if (dropsRef.current.length < columns) {
          const newDrops = Array(columns - dropsRef.current.length)
            .fill(0)
            .map(() => Math.random() * -100);
          dropsRef.current = [...dropsRef.current, ...newDrops];
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = "01";

    const getColors = () => {
      const style = getComputedStyle(document.body);
      return {
        fg: style.getPropertyValue('--fg').trim(),
        bg: style.getPropertyValue('--bg').trim(),
        accent: style.getPropertyValue('--accent').trim()
      };
    };

    let animationId: number;

    const draw = () => {
      const colors = getColors();
      const currentHovered = hoveredRef.current;
      const canvasW = canvas.width / (window.devicePixelRatio || 1);
      const canvasH = canvas.height / (window.devicePixelRatio || 1);

      ctx.fillStyle = colors.bg;
      ctx.globalAlpha = 0.25;
      ctx.fillRect(0, 0, canvasW, canvasH);

      ctx.fillStyle = currentHovered ? colors.accent : colors.fg;
      ctx.globalAlpha = currentHovered ? 0.3 : 0.02;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < dropsRef.current.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, dropsRef.current[i] * fontSize);

        if (dropsRef.current[i] * fontSize > canvasH && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }
        dropsRef.current[i] += currentHovered ? 1.8 : 0.4;
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0 block" 
    />
  );
};

const RatingIndicator: React.FC<{ score: number }> = ({ score }) => {
  const segments = 20;
  const activeSegments = Math.round((score / 100) * segments);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2 text-accent">
          <Cpu size={12} className="opacity-80" />
          <span className="font-mono text-[9px] uppercase font-black tracking-[0.2em]">Efficiency_Rating</span>
        </div>
        <span className="font-mono text-xl font-black tracking-tighter text-accent">{score}%</span>
      </div>
      <div className="flex gap-1 h-2">
        {Array.from({ length: segments }).map((_, i) => (
          <motion.div 
            key={i}
            initial={{ scaleY: 0.5, opacity: 0.2 }}
            animate={{ 
              scaleY: i < activeSegments ? 1 : 0.5,
              opacity: i < activeSegments ? 1 : 0.1,
            }}
            className={`flex-1 border-r border-fg/5 ${i < activeSegments ? 'bg-accent shadow-[0px_0px_8px_var(--accent)]' : 'bg-transparent'}`}
          />
        ))}
      </div>
    </div>
  );
};

const SkillOverlay: React.FC<{ 
  skill: { item: SkillItem; category: string }; 
  onClose: () => void 
}> = ({ skill, onClose }) => {
  const title = skill.category;
  const isCertifications = title.toUpperCase() === "CERTIFICATIONS";

  return createPortal(
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 40 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-bg border-2 border-accent shadow-[32px_32px_0px_0px_var(--fg)] flex flex-col max-h-[85vh] relative overflow-hidden"
      >
        <div className="p-5 border-b border-accent bg-accent text-bg flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-bg rounded-full animate-ping" />
            <span className="font-mono text-[10px] uppercase font-bold tracking-[0.3em]">
              KERNEL_REPORT: POINT_ANALYSIS
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-bg hover:text-accent p-2 transition-all border border-transparent hover:border-bg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 md:p-12 overflow-hidden">
          <div className="mb-10 text-center md:text-left">
            <h2 className="font-mono text-[10px] text-accent uppercase tracking-[0.5em] mb-4 border-b border-accent/20 pb-2 inline-block">
              {title}
            </h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold italic block mt-2">
              {skill.item.name}
            </h3>
          </div>

          <div className="space-y-12">
            <div className="group/item pb-12 last:border-0 last:pb-0">
              {!isCertifications && <RatingIndicator score={skill.item.score} />}
              
              <div className="mt-8 flex gap-4">
                <div className="w-px bg-accent/40 shrink-0" />
                <p className="font-mono text-[11px] md:text-xs opacity-80 leading-relaxed max-w-lg italic">
                  {isCertifications ? 'Verified credential. Mastery confirmed by official examination and industry-recognized standard.' : 
                   skill.item.score >= 95 ? 'Exceptional mastery. Capable of architecting high-performance systems and leading strategic technical direction.' : 
                   skill.item.score >= 90 ? 'Deep technical expertise. Ability to optimize performance and solve complex edge cases independently.' :
                   skill.item.score >= 80 ? 'Advanced proficiency. Strong operational knowledge with a focus on best practices and scalability.' :
                   'Core competency. Consistent delivery of functional solutions with a commitment to continuous iteration.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-accent/10 bg-accent/5 flex justify-between items-center shrink-0">
           <span className="font-mono text-[9px] text-accent opacity-60 uppercase tracking-[0.6em]">System.Metric_Analysis • v2.0.5</span>
           <div className="flex gap-2">
              <div className="w-1.5 h-1.5 bg-accent/40 rounded-full" />
              <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-pulse" />
           </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

const SkillCard: React.FC<{ 
  category: SkillCategory; 
  index: number; 
  onViewSkill: (skill: SkillItem, catName: string) => void;
}> = ({ category, index, onViewSkill }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{ 
        scale: isHovered ? 1.05 : 1,
        zIndex: isHovered ? 40 : 1,
        // Using boxShadow to simulate a 4-sided border on hover that won't shift layout
        boxShadow: isHovered ? "0 0 0 2px var(--accent)" : "0 0 0 0px transparent"
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative p-6 md:p-8 overflow-hidden flex flex-col min-h-[280px] bg-bg transition-colors border-fg ${
        // Default static borders to maintain the grid
        index % 3 !== 2 ? 'lg:border-r' : ''
      } ${
        index % 2 !== 1 ? 'sm:border-r lg:sm:border-r-0' : 'sm:border-r-0 lg:sm:border-r'
      } border-b`}
    >
      <BinaryRainCanvas isHovered={isHovered} />
      
      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        <div className="flex justify-between items-start mb-6">
          <h3 className={`font-mono text-[9px] uppercase font-bold border-b pb-1 tracking-[0.2em] transition-all duration-500 ${isHovered ? 'border-accent text-accent tracking-[0.3em]' : 'border-fg opacity-60'}`}>
              {category.category}
          </h3>
          <Target size={12} className={`transition-all duration-700 ${isHovered ? 'text-accent rotate-90 scale-110' : 'opacity-0'}`} />
        </div>
        <ul className="space-y-3 flex-1">
            {category.items.map(item => (
                <li 
                  key={item.name} 
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewSkill(item, category.category);
                  }}
                  className={`font-serif text-lg md:text-xl leading-tight transition-all duration-300 cursor-alias w-fit flex items-center gap-2 group/link pointer-events-auto ${
                    isHovered ? 'italic font-normal text-accent' : 'not-italic font-normal opacity-70'
                  } hover:!font-bold hover:!not-italic hover:translate-x-1`}
                >
                    {item.name}
                    <ChevronRight size={12} className={`transition-all ${isHovered ? 'opacity-80 translate-x-0' : 'opacity-0 -translate-x-1'}`} />
                </li>
            ))}
        </ul>
      </div>
    </motion.div>
  );
};

const Skills: React.FC = () => {
  const [viewingSkill, setViewingSkill] = useState<{ item: SkillItem; category: string } | null>(null);

  return (
    <section id="skills" className="grid grid-cols-1 md:grid-cols-4 bg-bg border-b border-fg">
      <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-fg flex items-center justify-center text-center bg-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none font-mono text-[8px] flex flex-wrap gap-2 p-1 overflow-hidden">
          {Array.from({ length: 100 }).map((_, i) => <span key={i}>01</span>)}
        </div>
        <h2 className="text-3xl md:text-4xl font-serif leading-tight relative z-10 italic"><ScrambleText text="Tech Stack" /></h2>
      </div>

      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-fg/5">
        {SKILLS_DATA.map((group, idx) => (
          <SkillCard 
            key={idx} 
            category={group} 
            index={idx} 
            onViewSkill={(item, catName) => setViewingSkill({ item, category: catName })}
          />
        ))}
      </div>

      <AnimatePresence>
        {viewingSkill && (
          <SkillOverlay 
            skill={viewingSkill}
            onClose={() => setViewingSkill(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Skills;