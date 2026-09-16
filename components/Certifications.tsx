import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, X, Cpu, Search, Calendar, FileText, Download } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { CERTIFICATIONS_DATA } from '../constants';
import { Certification } from '../types';

const Certifications: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL');
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [hoveredCert, setHoveredCert] = useState<Certification | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const categories = ['ALL', 'AI/ML', 'Data Science', 'Analytics'];
  
  const filteredCerts = filter === 'ALL' 
    ? CERTIFICATIONS_DATA 
    : CERTIFICATIONS_DATA.filter(c => c.category === filter);

  const openPreview = (cert: Certification) => {
    setSelectedCert(cert);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX + 20, y: e.clientY + 20 });
  };

  return (
    <section id="certifications" className="bg-bg relative">
      {/* Section Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-fg">
        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-fg flex flex-col justify-center">
            <h2 className="text-4xl font-serif italic"><ScrambleText text="Credentials" /></h2>
            <p className="font-mono text-[10px] uppercase opacity-40 mt-2 tracking-widest">Verified Specializations</p>
        </div>
        <div className="md:col-span-3 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 border font-mono text-[10px] uppercase font-bold transition-all ${filter === cat ? 'bg-fg text-bg' : 'hover:bg-fg/5'}`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
             <div className="flex items-center gap-4 font-mono text-[10px] opacity-40 uppercase tracking-widest">
                <Search size={14} /> SCANNING_{filteredCerts.length}_RECORDS
             </div>
        </div>
      </div>

      {/* Grid of Certs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredCerts.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onClick={() => openPreview(cert)}
            onMouseEnter={() => setHoveredCert(cert)}
            onMouseLeave={() => setHoveredCert(null)}
            onMouseMove={handleMouseMove}
            className="group relative border-b border-r border-fg p-8 md:p-10 flex flex-col justify-between hover:bg-fg/5 transition-all cursor-pointer overflow-hidden last:border-r-0"
          >
            {/* Background Texture */}
            <div className="absolute -top-10 -right-10 opacity-[0.03] font-mono text-[12rem] font-bold select-none pointer-events-none uppercase">
                {cert.issuer[0]}
            </div>

            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 flex items-center justify-center border border-fg/20 bg-fg/5">
                  <Award className="text-fg opacity-70" size={24} />
                </div>
                <span className="font-mono text-[9px] border border-fg px-2 py-0.5 uppercase opacity-60">
                  {cert.category}
                </span>
              </div>

              <div className="mb-8">
                <span className="font-mono text-[10px] uppercase opacity-40 block mb-2">{cert.issuer} • {cert.date}</span>
                <h3 className="text-2xl font-serif font-bold leading-tight group-hover:italic transition-all">
                  {cert.title}
                </h3>
              </div>

              <div className="space-y-3 mb-10">
                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.slice(0, 4).map(skill => (
                    <span key={skill} className="font-mono text-[9px] border border-fg/10 bg-fg/5 px-2 py-0.5 opacity-70">
                      {skill}
                    </span>
                  ))}
                  {cert.skills.length > 4 && (
                    <span className="font-mono text-[9px] opacity-40">+{cert.skills.length - 4} more</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-fg/10 flex justify-between items-center">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold group-hover:translate-x-1 transition-transform">
                View Certificate <ExternalLink size={12} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hover Preview Tooltip */}
      <AnimatePresence>
        {hoveredCert && createPortal(
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            style={{ 
              position: 'fixed', 
              left: mousePos.x, 
              top: mousePos.y,
              zIndex: 9999,
              pointerEvents: 'none'
            }}
            className="w-80 bg-bg border border-fg shadow-[12px_12px_0px_0px_var(--fg)] p-1 hidden md:block"
          >
             <div className="aspect-video w-full overflow-hidden bg-fg/10 mb-1 flex items-center justify-center">
                {hoveredCert.viewUrl ? (
                   <img 
                      src={`https://drive.google.com/thumbnail?id=${hoveredCert.viewUrl}&sz=w1000`} 
                      alt={hoveredCert.title} 
                      className="w-full h-full object-cover grayscale"
                   />
                ) : (
                  <div className="font-mono text-[10px] opacity-20 uppercase text-center p-8">
                    Pending Verification Record
                  </div>
                )}
             </div>
             <div className="bg-fg text-bg px-2 py-1 text-[10px] font-mono uppercase font-bold flex justify-between">
                <span>CREDENTIAL PREVIEW</span>
                <span>{hoveredCert.issuer}</span>
             </div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[110] bg-bg/95 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-6xl h-[90vh] bg-zinc-200 border-2 border-fg shadow-[32px_32px_0px_0px_var(--fg)] flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b-2 border-fg bg-fg text-bg shrink-0">
                  <div className="flex items-center gap-3">
                      <FileText size={18} />
                      <span className="font-mono text-xs uppercase font-bold tracking-[0.2em]">{selectedCert.title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                      {selectedCert.viewUrl && (
                        <a 
                          href={`https://drive.google.com/uc?export=download&id=${selectedCert.viewUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:bg-bg hover:text-fg px-4 py-2 rounded transition-colors font-mono text-[10px] font-bold uppercase border border-transparent hover:border-bg"
                        >
                            <Download size={14} /> DOWNLOAD PDF
                        </a>
                      )}
                      <button 
                          onClick={() => setSelectedCert(null)} 
                          className="hover:bg-bg hover:text-fg p-2 rounded transition-colors"
                      >
                          <X size={20} />
                      </button>
                  </div>
              </div>
              <div className="flex-1 bg-zinc-800 relative">
                  {selectedCert.viewUrl ? (
                    <iframe 
                        src={`https://drive.google.com/file/d/${selectedCert.viewUrl}/preview`}
                        className="w-full h-full border-none"
                        title="Certificate Viewer"
                        allow="autoplay"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-bg opacity-30 font-mono text-xl uppercase">
                      No Digital Asset Found
                    </div>
                  )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certifications;