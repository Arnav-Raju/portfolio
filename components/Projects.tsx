import React, { useState, useMemo } from 'react';
import ScrambleText from './ScrambleText';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, SlidersHorizontal, Github, ExternalLink, Cpu } from 'lucide-react';
import { createPortal } from 'react-dom';
import { PROJECTS_DATA } from '../constants';
import { Project } from '../types';

const Projects: React.FC = () => {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [difficultyFilter, setDifficultyFilter] = useState<number>(3);

  const filteredProjects = useMemo(() => {
    return [...PROJECTS_DATA]
      .filter(p => p.difficulty <= difficultyFilter)
      .sort((a, b) => b.difficulty - a.difficulty);
  }, [difficultyFilter]);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Offset the preview so it doesn't block the cursor
    const offset = 40;
    setMousePos({ x: e.clientX + offset, y: e.clientY + offset });
  };

  const getDifficultyLabel = (val: number) => {
    if (val === 1) return "BEGINNER";
    if (val === 2) return "ADVANCED";
    return "INSANE";
  };

  const handleProjectClick = (project: Project) => {
    const url = project.demoUrl || project.repoUrl;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="projects" className="bg-bg relative">
      {/* Header Info Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-fg">
        <div className="p-8 border-b md:border-b-0 md:border-r border-fg flex flex-col justify-center bg-fg/5">
            <h2 className="text-3xl font-serif italic"><ScrambleText text="Selected Works" /></h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              <p className="font-mono text-[9px] uppercase font-bold tracking-[0.3em] text-accent">Interactive_Archives</p>
            </div>
        </div>
        <div className="md:col-span-3 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex flex-col gap-2 w-full md:w-64">
                <div className="flex justify-between items-center font-mono text-[10px] uppercase opacity-40">
                  <span>Complexity Threshold</span>
                  <span className="text-accent font-bold">{getDifficultyLabel(difficultyFilter)}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="1"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(parseInt(e.target.value))}
                  className="w-full accent-accent h-1 bg-fg/10 appearance-none cursor-pointer"
                />
             </div>
             <div className="flex items-center gap-6">
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-50 flex items-center gap-2">
                   <SlidersHorizontal size={14} className="text-accent" /> Total_Records: {filteredProjects.length}
                </span>
                <div className="hidden md:block w-px h-8 bg-fg/10" />
                <span className="hidden md:block font-mono text-[9px] uppercase opacity-30 italic">Click to launch live environment</span>
             </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex flex-col relative">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => {
            const paddedIndex = `0${index + 1}`;
            
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onClick={() => handleProjectClick(project)}
                onMouseEnter={() => setHoveredProject(project)}
                onMouseLeave={() => setHoveredProject(null)}
                onMouseMove={handleMouseMove}
                className="group grid grid-cols-1 md:grid-cols-12 border-b border-fg min-h-[140px] transition-all hover:bg-fg hover:text-bg cursor-pointer relative bg-bg overflow-hidden"
              >
                {/* ID Column */}
                <div className="md:col-span-1 p-6 md:p-8 font-mono text-xs opacity-40 border-b md:border-b-0 md:border-r border-fg group-hover:border-bg group-hover:opacity-100 flex flex-col justify-between items-center md:items-start">
                  <span className="font-black">#{paddedIndex}</span>
                  <div className="hidden md:block w-4 h-4 border border-current opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>

                {/* Title & Type Column */}
                <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-fg group-hover:border-bg">
                  <div className="flex items-center gap-4 mb-2">
                    <span className={`text-[8px] font-mono px-2 py-0.5 border ${project.difficulty === 3 ? 'bg-accent border-accent text-bg' : 'border-current'}`}>
                        {getDifficultyLabel(project.difficulty)}
                    </span>
                    <span className="font-mono text-[8px] opacity-40 uppercase group-hover:text-bg/60">Deployment_Link</span>
                  </div>
                  <h3 className="text-5xl md:text-6xl font-serif font-black tracking-tighter group-hover:italic transition-all leading-none py-2">
                      {project.title}
                  </h3>
                </div>

                {/* Tags / Metadata Column */}
                <div className="md:col-span-5 p-6 md:p-8 flex flex-wrap content-center gap-2 border-b md:border-b-0 md:border-r border-fg group-hover:border-bg">
                    {project.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-mono border border-current/20 px-3 py-1 uppercase group-hover:border-bg/40 tracking-widest font-bold">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Interactive Arrow Column */}
                <div className="md:col-span-1 p-6 md:p-8 flex items-center justify-center group-hover:border-bg group-hover:bg-accent group-hover:text-bg transition-all">
                    <div className="relative">
                      <ArrowUpRight className="w-10 h-10 transition-transform group-hover:-translate-y-2 group-hover:translate-x-2" />
                      <div className="absolute -inset-2 border border-current opacity-0 group-hover:opacity-20 scale-150 group-hover:scale-100 transition-all duration-500" />
                    </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Exceptional Hover Preview Viewport */}
      <AnimatePresence>
        {hoveredProject && hoveredProject.imageUrl && createPortal(
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -10, y: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{ 
              position: 'fixed', 
              left: mousePos.x, 
              top: mousePos.y,
              zIndex: 9999,
              pointerEvents: 'none',
              perspective: '1200px'
            }}
            className="w-[450px] bg-bg border-2 border-accent shadow-[32px_32px_0px_0px_var(--fg)] p-1 hidden md:block"
          >
             {/* Main Viewport Container */}
             <div className="aspect-video w-full overflow-hidden bg-black relative">
                <img 
                   src={hoveredProject.imageUrl} 
                   alt={hoveredProject.title} 
                   className="w-full h-full object-cover grayscale brightness-75 transition-all duration-500 group-hover:grayscale-0 group-hover:brightness-100"
                />

                {/* Data Scanning Line Overlay */}
                <motion.div 
                   animate={{ top: ['-10%', '110%'] }}
                   transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                   className="absolute left-0 right-0 h-[2px] bg-accent/60 z-20 shadow-[0_0_15px_var(--accent)]"
                />

                {/* HUD Overlay Elements */}
                <div className="absolute inset-0 z-10 p-4 flex flex-col justify-between pointer-events-none">
                   {/* Top HUD */}
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 bg-accent text-bg px-2 py-0.5">
                         <div className="w-1.5 h-1.5 bg-bg rounded-full animate-pulse" />
                         <span className="font-mono text-[8px] font-black uppercase tracking-widest">Live_Viewport_0.9</span>
                      </div>
                      <div className="flex gap-1">
                         {[1, 2, 3].map(i => (
                           <div key={i} className="w-1 h-3 bg-accent/20" />
                         ))}
                      </div>
                   </div>

                   {/* Center Target Marker */}
                   <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <div className="w-20 h-20 border border-accent/40 rounded-full flex items-center justify-center">
                         <div className="w-[1px] h-4 bg-accent" />
                         <div className="w-4 h-[1px] bg-accent absolute" />
                      </div>
                   </div>

                   {/* Bottom HUD */}
                   <div className="flex justify-between items-end">
                      <div className="font-mono text-[8px] text-accent font-bold space-y-1">
                        <div className="flex gap-2"><span>RES:</span> <span className="text-fg">1920_X_1080</span></div>
                        <div className="flex gap-2"><span>SRC:</span> <span className="text-fg truncate max-w-[150px]">{hoveredProject.id.toUpperCase()}</span></div>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="font-mono text-[10px] text-accent font-black tracking-tighter">RENDER_ARTIFACT</span>
                         <div className="flex gap-1 mt-1">
                           <div className="w-4 h-1 bg-accent" />
                           <div className="w-1 h-1 bg-accent/30" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent" />
             </div>

             {/* Footer Label */}
             <div className="bg-fg text-bg px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <Cpu size={14} className="text-accent" />
                   <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em]">{hoveredProject.title}</span>
                </div>
                <span className="font-mono text-[8px] opacity-40">SYSTEM_RECORD_CONFIRMED</span>
             </div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;