import React, { useState, useMemo, useEffect, useRef } from 'react';
import ScrambleText from './ScrambleText';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, GraduationCap, Zap, Activity, ChevronRight, Minimize2, Maximize2, ChevronDown, Plane, DollarSign, Rocket, BookOpen, Cpu, Terminal, LineChart } from 'lucide-react';
import { EXPERIENCE_DATA } from '../constants';
import { Experience as ExperienceType } from '../types';

/**
 * FocusBackground Component: Handles different animations based on experience type
 */
const FocusBackground: React.FC<{ type: 'work' | 'education' }> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 16;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops = Array(columns).fill(0).map(() => Math.random() * -100);
    
    // Symbols based on type
    const symbols = type === 'work' 
      ? "01" 
      : "+-x÷=≠√ΣΔΩπ∫≈∞";

    const getColors = () => {
      const style = getComputedStyle(document.body);
      return {
        fg: style.getPropertyValue('--fg').trim(),
        bg: style.getPropertyValue('--bg').trim()
      };
    };

    let frameId: number;
    const draw = () => {
      const colors = getColors();
      ctx.fillStyle = colors.bg + '15'; // 15 = roughly 0.1 opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = colors.fg;
      ctx.font = `${fontSize}px Space Mono`;

      for (let i = 0; i < drops.length; i++) {
        const text = symbols[Math.floor(Math.random() * symbols.length)];
        
        // Horizontal variations for math (flying around) vs vertical for binary (falling)
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.globalAlpha = type === 'education' ? 0.15 : 0.25;
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Speed variation
        drops[i] += type === 'education' ? 0.5 : 1;
      }
      ctx.globalAlpha = 1.0;
      frameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, [type]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />;
};

const renderHoverEffect = (expId: string, viewType: 'grid' | 'focus' | 'overview') => {
  const sizes = {
    grid: { icon: "w-8 h-8 md:w-10 md:h-10", orbit: "translate-x-[70px] md:translate-x-[80px]" },
    focus: { icon: "w-6 h-6 md:w-8 md:h-8", orbit: "translate-x-[50px] md:translate-x-[60px]" },
    overview: { icon: "w-5 h-5 md:w-6 md:h-6", orbit: "translate-x-[40px] md:translate-x-[50px]" }
  };
  const s = sizes[viewType];
  
  const hoverOpacityClass = viewType === 'grid' 
    ? 'group-hover/stamp:opacity-100' 
    : viewType === 'focus' 
    ? 'group-hover/focus-stamp:opacity-100' 
    : 'group-hover/overview-stamp:opacity-100';

  const commonClasses = `absolute inset-0 z-30 pointer-events-none opacity-0 ${hoverOpacityClass} transition-opacity duration-300`;

  switch (expId) {
    case 'work-standardaero':
      return (
        <div className={`${commonClasses} flex items-center justify-center animate-fly-circle`}>
          <Plane className={`text-fg ${s.icon} ${s.orbit} rotate-[135deg] drop-shadow-md`} />
        </div>
      );
    case 'work-fhlb':
      return (
        <div className={commonClasses}>
          <div className="absolute -top-2 -right-2 animate-float-up">
            <DollarSign className={`text-fg ${s.icon} drop-shadow-md`} />
          </div>
          <div className="absolute -bottom-2 -left-2 animate-float-up" style={{ animationDelay: '1s' }}>
            <DollarSign className={`text-fg ${s.icon} drop-shadow-md`} />
          </div>
        </div>
      );
    case 'work-jcc':
      return (
        <div className={commonClasses}>
          <div className="absolute -top-4 -right-4 animate-rocket-fly">
            <Rocket className={`text-fg ${s.icon} drop-shadow-md`} />
          </div>
        </div>
      );
    case 'work-tutor':
      return (
        <div className={commonClasses}>
          <div className="absolute -top-2 -left-2 animate-bounce-soft">
            <BookOpen className={`text-fg ${s.icon} drop-shadow-md`} />
          </div>
          <div className="absolute -bottom-2 -right-2 animate-bounce-soft" style={{ animationDelay: '1s' }}>
            <BookOpen className={`text-fg ${s.icon} drop-shadow-md`} />
          </div>
        </div>
      );
    case 'edu-utd':
    case 'edu-nitr':
      return (
        <div className={commonClasses}>
          <div className="absolute -top-4 -right-2 animate-bounce-soft">
            <GraduationCap className={`text-fg ${s.icon} drop-shadow-md`} />
          </div>
        </div>
      );
    case 'work-exl':
      return (
        <div className={commonClasses}>
          <div className="absolute -top-3 -left-3 animate-pulse-glow">
            <Cpu className={`text-fg ${s.icon} drop-shadow-md`} />
          </div>
          <div className="absolute -bottom-3 -right-3 animate-pulse-glow" style={{ animationDelay: '1s' }}>
            <Zap className={`text-fg ${s.icon} drop-shadow-md`} />
          </div>
        </div>
      );
    case 'work-issi':
      return (
        <div className={commonClasses}>
          <div className="absolute -bottom-2 -left-2 animate-spin-slow">
            <Terminal className={`text-fg ${s.icon} drop-shadow-md`} />
          </div>
        </div>
      );
    case 'work-solve':
      return (
        <div className={commonClasses}>
          <div className="absolute -bottom-2 -right-2 animate-slide-chart">
            <LineChart className={`text-fg ${s.icon} drop-shadow-md`} />
          </div>
        </div>
      );
    default:
      return null;
  }
}

const Experience: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverviewMode, setIsOverviewMode] = useState(false);
  const [selectedExp, setSelectedExp] = useState<ExperienceType | null>(null);

  const handleOpenTimeline = () => {
    if ('vibrate' in navigator) navigator.vibrate(20);
    setIsExpanded(true);
    setIsOverviewMode(false);
  };

  const handlePointClick = (exp: ExperienceType) => {
    if ('vibrate' in navigator) navigator.vibrate(10);
    setSelectedExp(exp);
  };

  const allExperiences = useMemo(() => EXPERIENCE_DATA, []);

  return (
    <section id="experience" className="bg-bg border-b border-fg relative">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* --- STATIC VIEW --- */
          <motion.div 
            key="static-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-fg">
              <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-fg flex items-center">
                <h2 className="text-4xl font-serif"><ScrambleText text="Experience" /></h2>
              </div>
              <div className="md:col-span-3 p-8 md:p-12 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.3em] opacity-40">CHRONOLOGICAL HISTORY</span>
                <button 
                  onClick={handleOpenTimeline}
                  className="group flex items-center gap-3 font-mono text-[10px] uppercase font-bold border border-fg px-6 py-3 hover:bg-fg hover:text-bg transition-all"
                >
                  <Zap size={14} className="group-hover:animate-bounce" /> INITIALIZE JOURNEY
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              {allExperiences.map((exp, index) => (
                <div key={exp.id} className="grid grid-cols-1 md:grid-cols-12 border-b border-fg last:border-b-0 group">
                  <div className="md:col-span-3 p-8 md:p-12 border-b md:border-b-0 md:border-r border-fg font-mono text-xs flex flex-col gap-6">
                    <div className="opacity-60">
                      <div className="flex items-center gap-2 mb-2">
                         {exp.type === 'work' ? <Briefcase size={12} /> : <GraduationCap size={12} />}
                         <span className="uppercase tracking-widest">{exp.type}</span>
                      </div>
                      {exp.period}
                    </div>
                    {(exp.logoUrl || exp.logoUrls) && (
                      <div className={`relative w-full mt-4 ${ (exp.logoUrls?.length || 1) > 1 ? 'h-64' : 'h-40' }`}>
                        {(exp.logoUrls || [exp.logoUrl]).map((url, logoIdx) => {
                          const isSingle = (exp.logoUrls?.length || 1) === 1;
                          return url && (
                            <motion.div 
                              key={`${exp.id}-logo-${logoIdx}`}
                              initial={{ 
                                rotate: isSingle ? -4 : logoIdx === 0 ? -12 : logoIdx === 1 ? 15 : -5,
                                scale: 0.9
                              }}
                              whileHover={{ 
                                scale: 1.1, 
                                rotate: 0,
                                zIndex: 50,
                                transition: { type: "spring", stiffness: 400, damping: 10 }
                              }}
                              className={`w-32 h-32 md:w-36 md:h-36 absolute flex items-center justify-center cursor-pointer group/stamp ${
                                isSingle ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' :
                                logoIdx === 0 ? 'top-0 left-0' : 
                                logoIdx === 1 ? 'top-0 right-0' : 
                                'bottom-0 left-1/2 -translate-x-1/2'
                              }`}
                              style={{ zIndex: 10 + logoIdx }}
                            >
                              {/* The Stamp/Seal Shape */}
                              <div 
                                className="absolute inset-0 bg-[#B71C1C] shadow-[4px_4px_15px_rgba(0,0,0,0.3)] transition-colors duration-300 group-hover/stamp:bg-[#D32F2F]"
                                style={{ 
                                  clipPath: "polygon(50% 2%, 58% 8%, 68% 3%, 72% 12%, 82% 10%, 84% 20%, 94% 20%, 92% 30%, 98% 35%, 93% 45%, 100% 50%, 93% 55%, 98% 65%, 92% 70%, 94% 80%, 84% 80%, 82% 90%, 72% 88%, 68% 97%, 58% 92%, 50% 98%, 42% 92%, 32% 97%, 28% 88%, 18% 90%, 16% 80%, 6% 80%, 8% 70%, 2% 65%, 7% 55%, 0% 50%, 7% 45%, 2% 35%, 8% 30%, 6% 20%, 16% 20%, 18% 10%, 28% 12%, 32% 3%, 42% 8%)"
                                }}
                              />
                              {/* Inner White Circle for Logo Clarity */}
                              <div className="absolute inset-[10%] bg-white rounded-full flex items-center justify-center p-4 z-10 shadow-inner overflow-hidden">
                                <img 
                                  src={url} 
                                  alt={`${exp.company} logo`} 
                                  className={`max-w-full max-h-full object-contain transition-all duration-500 group-hover/stamp:scale-110 group-hover/stamp:brightness-110 ${exp.id === 'work-fhlb' ? 'scale-[1.3]' : exp.id === 'work-standardaero' ? 'scale-[3]' : ''}`}
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              {/* Texture Overlays - Faded on hover for clarity */}
                              <div className="absolute inset-0 opacity-20 group-hover/stamp:opacity-5 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/stucco.png')] z-20 transition-opacity duration-300" />
                              <div className="absolute inset-0 opacity-10 group-hover/stamp:opacity-0 pointer-events-none mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] z-20 transition-opacity duration-300" />
                              
                              {/* Dynamic Hover Effect */}
                              {renderHoverEffect(exp.id, 'grid')}
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-9 p-8 md:p-12 relative">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-6 gap-2">
                      <h3 className="text-3xl md:text-4xl font-serif font-bold group-hover:italic transition-all duration-500">
                        {exp.company}
                      </h3>
                      <span className="font-mono text-[10px] md:text-xs uppercase font-bold tracking-widest opacity-80">
                        {exp.role}
                      </span>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {exp.description.map((point, i) => (
                        <li key={i} className="font-mono text-xs md:text-sm leading-relaxed opacity-60 flex gap-4">
                          <span className="shrink-0">-</span>
                          {point}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map(tech => (
                        <span key={tech} className="text-[9px] font-mono border border-fg px-2 py-1 uppercase opacity-80">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* --- INTERACTIVE JOURNEY --- */
          <motion.div 
            key="timeline-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[80] bg-bg flex flex-col"
          >
            <div className="sticky top-0 z-[100] bg-bg border-b border-fg flex justify-between items-center p-4 md:p-6 px-8 shrink-0">
              <div className="flex items-center gap-4 md:gap-8">
                 <button 
                  onClick={() => setIsOverviewMode(!isOverviewMode)}
                  className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold border border-fg px-4 py-2 hover:bg-fg hover:text-bg transition-all"
                 >
                   {isOverviewMode ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
                   {isOverviewMode ? "Expand to Focus" : "Minimize to List"}
                 </button>
                 <div className="hidden md:flex items-center gap-2 font-mono text-[10px] uppercase opacity-40">
                    <Activity size={12} className="animate-pulse" />
                    {isOverviewMode ? 'ARCHIVE OVERVIEW' : 'FOCUS NAVIGATION'}
                 </div>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="font-mono text-[10px] uppercase font-bold border border-fg px-6 py-2 hover:bg-fg hover:text-bg transition-all flex items-center gap-2"
              >
                <X size={14} /> EXIT
              </button>
            </div>

            <div className={`flex-1 overflow-y-auto custom-scrollbar ${!isOverviewMode ? 'snap-y snap-mandatory' : 'scroll-smooth'}`}>
              
              {!isOverviewMode ? (
                /* --- FOCUS MODE --- */
                <div className="h-full">
                  {EXPERIENCE_DATA.map((exp, index) => (
                    <section key={exp.id} className="h-full w-full snap-start flex items-center justify-center p-8 md:p-16 border-b border-fg last:border-b-0 relative overflow-hidden">
                      {/* Dynamic Background Animation */}
                      <FocusBackground type={exp.type} />
                      
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ margin: "-20%" }}
                        className="max-w-6xl w-full flex flex-col items-center text-center relative z-10"
                      >
                         <span className="font-mono text-sm md:text-lg uppercase tracking-[0.5em] opacity-40 mb-8">{exp.period}</span>
                         <h3 className="text-5xl md:text-[7rem] font-serif font-bold leading-none mb-10 group cursor-default">
                           <span className="group-hover:italic transition-all duration-700">{exp.company}</span>
                         </h3>
                         
                         <div className="flex flex-col items-center gap-6 mb-12">
                            <div className="flex items-center gap-4">
                                {(exp.logoUrl || exp.logoUrls) ? (
                                  <div className={`relative shrink-0 ${ (exp.logoUrls?.length || 1) > 1 ? 'w-32 h-32 md:w-44 md:h-44' : 'w-20 h-20 md:w-28 md:h-28' }`}>
                                    {(exp.logoUrls || [exp.logoUrl]).map((url, logoIdx) => {
                                      const isSingle = (exp.logoUrls?.length || 1) === 1;
                                      return url && (
                                        <div 
                                          key={`${exp.id}-focus-${logoIdx}`} 
                                          className={`absolute flex items-center justify-center transition-all duration-300 group-hover/focus-stamp:scale-110 group/focus-stamp ${
                                            isSingle ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 rotate-[4deg]' :
                                            logoIdx === 0 ? 'top-0 left-0 w-20 h-20 md:w-28 md:h-28 rotate-[-12deg]' : 
                                            logoIdx === 1 ? 'top-0 right-0 w-20 h-20 md:w-28 md:h-28 rotate-[15deg]' : 
                                            'bottom-0 left-1/2 -translate-x-1/2 w-20 h-20 md:w-28 md:h-28 rotate-[-5deg]'
                                          }`}
                                          style={{ zIndex: 10 + logoIdx }}
                                        >
                                          <div 
                                            className="absolute inset-0 bg-[#B71C1C] shadow-lg transition-colors duration-300 group-hover/focus-stamp:bg-[#D32F2F]"
                                            style={{ 
                                              clipPath: "polygon(50% 2%, 58% 8%, 68% 3%, 72% 12%, 82% 10%, 84% 20%, 94% 20%, 92% 30%, 98% 35%, 93% 45%, 100% 50%, 93% 55%, 98% 65%, 92% 70%, 94% 80%, 84% 80%, 82% 90%, 72% 88%, 68% 97%, 58% 92%, 50% 98%, 42% 92%, 32% 97%, 28% 88%, 18% 90%, 16% 80%, 6% 80%, 8% 70%, 2% 65%, 7% 55%, 0% 50%, 7% 45%, 2% 35%, 8% 30%, 6% 20%, 16% 20%, 18% 10%, 28% 12%, 32% 3%, 42% 8%)"
                                            }}
                                          />
                                          <div className="absolute inset-[10%] bg-white rounded-full flex items-center justify-center p-3 z-10 overflow-hidden">
                                            <img 
                                              src={url} 
                                              alt={`${exp.company} logo`} 
                                              className={`max-w-full max-h-full object-contain transition-all duration-500 group-hover/focus-stamp:scale-110 group-hover/focus-stamp:brightness-110 ${exp.id === 'work-fhlb' ? 'scale-[1.3]' : exp.id === 'work-standardaero' ? 'scale-[3]' : ''}`}
                                              referrerPolicy="no-referrer"
                                            />
                                          </div>
                                          <div className="absolute inset-0 opacity-15 group-hover/focus-stamp:opacity-0 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/stucco.png')] z-20 transition-opacity duration-300" />
                                          
                                          {/* Dynamic Hover Effect */}
                                          {renderHoverEffect(exp.id, 'focus')}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className={`w-14 h-14 flex items-center justify-center border-2 border-fg shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] ${exp.type === 'work' ? 'bg-fg text-bg' : 'bg-bg text-fg'}`}>
                                      {exp.type === 'work' ? <Briefcase size={24} /> : <GraduationCap size={24} />}
                                  </div>
                                )}
                                <span className="font-mono text-xl md:text-3xl uppercase font-bold tracking-widest">{exp.role}</span>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3">
                                {exp.technologies.map(t => (
                                    <span key={t} className="px-5 py-2 border-2 border-fg/30 font-mono text-xs uppercase font-bold bg-bg/40 backdrop-blur-sm">
                                        {t}
                                    </span>
                                ))}
                            </div>
                         </div>

                         <div className="max-w-2xl mx-auto mb-12">
                            <p className="font-mono text-base md:text-xl leading-relaxed opacity-80 bg-bg/30 p-4 rounded-none backdrop-blur-[2px]">
                                {exp.description[0]}
                            </p>
                         </div>

                         <button 
                            onClick={() => handlePointClick(exp)}
                            className="group flex items-center gap-4 font-mono text-xs uppercase font-bold border-2 border-fg px-12 py-6 hover:bg-fg hover:text-bg transition-all bg-bg"
                         >
                            Access Full Records <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                         </button>
                      </motion.div>

                      {/* Centered Scroll Down Animation */}
                      {index < EXPERIENCE_DATA.length - 1 && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20">
                            <motion.div 
                              animate={{ y: [0, 8, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                              className="flex flex-col items-center"
                            >
                                <span className="font-mono text-[9px] uppercase tracking-[0.5em] opacity-40 mb-2">Proceed</span>
                                <div className="w-[1px] h-10 bg-fg/40 mb-2"></div>
                                <ChevronDown size={18} className="opacity-60" />
                            </motion.div>
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              ) : (
                /* --- OVERVIEW MODE --- */
                <div className="max-w-4xl mx-auto py-32 md:py-48 px-8">
                  <div className="flex flex-col gap-24 md:gap-32">
                    {EXPERIENCE_DATA.map((exp) => {
                      const Icon = exp.type === 'work' ? Briefcase : GraduationCap;
                      return (
                        <motion.div 
                          key={exp.id}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: false, amount: 0.3 }}
                          className="group flex flex-col md:flex-row items-start gap-8 md:gap-12"
                        >
                          <div className={`shrink-0 relative ${ (exp.logoUrls?.length || 1) > 1 ? 'w-32 h-32 md:w-40 md:h-40' : 'w-20 h-20 md:w-24 md:h-24' }`}>
                              {(exp.logoUrls || [exp.logoUrl]).map((url, logoIdx) => {
                                const isSingle = (exp.logoUrls?.length || 1) === 1;
                                return url && (
                                  <div 
                                    key={`${exp.id}-overview-${logoIdx}`} 
                                    className={`absolute w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group/overview-stamp ${
                                      isSingle ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-4deg]' :
                                      logoIdx === 0 ? 'top-0 left-0 rotate-[-12deg]' : 
                                      logoIdx === 1 ? 'top-0 right-0 rotate-[15deg]' : 
                                      'bottom-0 left-1/2 -translate-x-1/2 rotate-[-5deg]'
                                    }`}
                                    style={{ zIndex: 10 + logoIdx }}
                                  >
                                    <div 
                                      className="absolute inset-0 bg-[#B71C1C] shadow-md transition-colors duration-300 group-hover/overview-stamp:bg-[#D32F2F]"
                                      style={{ 
                                        clipPath: "polygon(50% 2%, 58% 8%, 68% 3%, 72% 12%, 82% 10%, 84% 20%, 94% 20%, 92% 30%, 98% 35%, 93% 45%, 100% 50%, 93% 55%, 98% 65%, 92% 70%, 94% 80%, 84% 80%, 82% 90%, 72% 88%, 68% 97%, 58% 92%, 50% 98%, 42% 92%, 32% 97%, 28% 88%, 18% 90%, 16% 80%, 6% 80%, 8% 70%, 2% 65%, 7% 55%, 0% 50%, 7% 45%, 2% 35%, 8% 30%, 6% 20%, 16% 20%, 18% 10%, 28% 12%, 32% 3%, 42% 8%)"
                                      }}
                                    />
                                    <div className="absolute inset-[10%] bg-white rounded-full flex items-center justify-center p-2 z-10 overflow-hidden">
                                      <img 
                                        src={url} 
                                        alt={`${exp.company} logo`} 
                                        className={`max-w-full max-h-full object-contain transition-all duration-500 group-hover/overview-stamp:scale-110 group-hover/overview-stamp:brightness-110 ${exp.id === 'work-fhlb' ? 'scale-[1.3]' : exp.id === 'work-standardaero' ? 'scale-[3]' : ''}`}
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                    <div className="absolute inset-0 opacity-15 group-hover/overview-stamp:opacity-0 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/stucco.png')] z-20 transition-opacity duration-300" />
                                    
                                    {/* Dynamic Hover Effect */}
                                    {renderHoverEffect(exp.id, 'overview')}
                                  </div>
                                );
                              })}
                              <div className="absolute -bottom-4 left-0 font-mono text-[10px] uppercase font-bold tracking-widest opacity-40 md:hidden">
                                  {exp.period}
                              </div>
                          </div>

                          <div className="flex-1 space-y-4">
                             <div className="space-y-1">
                                <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.4em] opacity-30">{exp.period}</span>
                                <h3 className="text-3xl md:text-5xl font-serif font-bold group-hover:italic transition-all duration-700">{exp.company}</h3>
                                <div className="flex items-center gap-4">
                                  <span className="font-mono text-xs uppercase font-bold text-fg/60 tracking-wider">{exp.role}</span>
                                  <div className={`px-2 py-0.5 text-[9px] font-mono uppercase border border-fg/20 ${exp.type === 'education' ? 'bg-fg text-bg' : ''}`}>
                                    {exp.type}
                                  </div>
                                </div>
                             </div>
                             <div className="max-w-xl">
                                <p className="font-mono text-sm leading-relaxed opacity-60 mb-6">
                                  {exp.description[0]}
                                </p>
                                <button 
                                  onClick={() => handlePointClick(exp)}
                                  className="font-mono text-[10px] uppercase font-bold border border-fg px-4 py-2 hover:bg-fg hover:text-bg transition-all flex items-center gap-2"
                                >
                                  View Detailed Record <ChevronRight size={12} />
                                </button>
                             </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="h-64 flex items-center justify-center">
                      <div className="w-1 h-20 bg-fg/10 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedExp && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-bg/95 backdrop-blur-xl" onClick={() => setSelectedExp(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-bg border-2 border-fg shadow-[30px_30px_0px_0px_var(--fg)] flex flex-col max-h-[85vh] overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b-2 border-fg bg-fg text-bg shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-bg rounded-full animate-pulse"></div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest">Protocol: Record_Access</span>
                </div>
                <button onClick={() => setSelectedExp(null)} className="hover:bg-bg hover:text-fg p-1 transition-all border border-transparent hover:border-bg">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar">
                <div className="mb-14 flex flex-col md:flex-row items-center md:items-start gap-8">
                  {(selectedExp.logoUrl || selectedExp.logoUrls) && (
                    <div className={`relative shrink-0 mb-8 md:mb-0 ${ (selectedExp.logoUrls?.length || 1) > 1 ? 'w-48 h-48 md:w-64 md:h-64' : 'w-32 h-32 md:w-44 md:h-44' }`}>
                      {(selectedExp.logoUrls || [selectedExp.logoUrl]).map((url, logoIdx) => {
                        const isSingle = (selectedExp.logoUrls?.length || 1) === 1;
                        return url && (
                          <div 
                            key={`modal-logo-${logoIdx}`} 
                            className={`absolute flex items-center justify-center ${
                              isSingle ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-44 md:h-44 rotate-[-4deg]' :
                              logoIdx === 0 ? 'top-0 left-0 w-28 h-28 md:w-36 md:h-36 rotate-[-12deg]' : 
                              logoIdx === 1 ? 'top-0 right-0 w-28 h-28 md:w-36 md:h-36 rotate-[15deg]' : 
                              'bottom-0 left-1/2 -translate-x-1/2 w-28 h-28 md:w-36 md:h-36 rotate-[-5deg]'
                            }`}
                            style={{ 
                              zIndex: 10 + logoIdx 
                            }}
                          >
                            <div 
                              className="absolute inset-0 bg-[#B71C1C] shadow-xl"
                              style={{ 
                                clipPath: "polygon(50% 2%, 58% 8%, 68% 3%, 72% 12%, 82% 10%, 84% 20%, 94% 20%, 92% 30%, 98% 35%, 93% 45%, 100% 50%, 93% 55%, 98% 65%, 92% 70%, 94% 80%, 84% 80%, 82% 90%, 72% 88%, 68% 97%, 58% 92%, 50% 98%, 42% 92%, 32% 97%, 28% 88%, 18% 90%, 16% 80%, 6% 80%, 8% 70%, 2% 65%, 7% 55%, 0% 50%, 7% 45%, 2% 35%, 8% 30%, 6% 20%, 16% 20%, 18% 10%, 28% 12%, 32% 3%, 42% 8%)"
                              }}
                            />
                            <div className="absolute inset-[10%] bg-white rounded-full flex items-center justify-center p-4 z-10 overflow-hidden">
                              <img 
                                src={url} 
                                alt={`${selectedExp.company} logo`} 
                                className={`max-w-full max-h-full object-contain ${selectedExp.id === 'work-fhlb' ? 'scale-[1.3]' : selectedExp.id === 'work-standardaero' ? 'scale-[3]' : ''}`}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/stucco.png')] z-20" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="text-center md:text-left">
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-40 block mb-6">{selectedExp.period}</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-none">{selectedExp.company}</h2>
                    <div className="inline-block bg-fg/10 border border-fg px-4 py-2 font-mono text-[10px] uppercase font-bold tracking-widest">
                      {selectedExp.role}
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  <div>
                    <h4 className="font-mono text-[10px] uppercase font-bold text-fg/30 mb-8 tracking-[0.3em] border-b border-fg/10 pb-2">Narrative / Analysis</h4>
                    <ul className="space-y-6">
                      {selectedExp.description.map((item, i) => (
                        <li key={i} className="font-mono text-sm leading-relaxed flex gap-6">
                          <span className="text-fg opacity-30 font-bold">[{i+1}]</span>
                          <span className="opacity-80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-mono text-[10px] uppercase font-bold text-fg/30 mb-8 tracking-[0.3em] border-b border-fg/10 pb-2">Technical Core</h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedExp.technologies.map(tech => (
                        <span key={tech} className="text-[10px] font-mono border border-fg px-5 py-2 uppercase hover:bg-fg hover:text-bg transition-all font-bold">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t-2 border-fg bg-fg/5 flex justify-between items-center shrink-0">
                <span className="font-mono text-[9px] opacity-40 uppercase">ID_{selectedExp.id.toUpperCase()}</span>
                <button 
                  onClick={() => setSelectedExp(null)}
                  className="font-mono text-[10px] uppercase font-bold border-2 border-fg px-10 py-3 hover:bg-fg hover:text-bg transition-all"
                >
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Experience;