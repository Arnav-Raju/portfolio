import React, { useState } from 'react';
import ScrambleText from './ScrambleText';
import { Eye, X, Download, Mail, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TerminalContact from './TerminalContact';

const Contact: React.FC = () => {
  const [showResume, setShowResume] = useState(false);
  
  // The specific ID provided by the user in the new link
  const RESUME_ID = "1ptfNvwqKRSkUJpk_YixzLuHi_fhxQ4It";
  const resumePreviewUrl = `https://drive.google.com/file/d/${RESUME_ID}/preview`;
  
  // Direct download endpoint for Google Drive files
  const resumeDownloadUrl = `https://drive.google.com/uc?export=download&id=${RESUME_ID}`;

  return (
    <section id="contact" className="p-8 md:p-24 flex flex-col items-center text-center bg-bg relative overflow-hidden min-h-[60vh] justify-center">
      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[20vw] opacity-[0.02] pointer-events-none select-none font-bold italic">
        Connect
      </div>

      <h2 className="text-5xl md:text-[8rem] font-serif mb-8 leading-none relative z-10"><ScrambleText text="Let's Talk." /></h2>
      <p className="font-mono text-sm md:text-lg max-w-2xl mb-12 leading-relaxed opacity-80 relative z-10">
        I’m currently open to internships and roles that align with software engineering, machine learning, and AI. Drop a command below to reach out.
      </p>
      
      <div className="w-full relative z-10 mb-20">
        <TerminalContact onOpenResume={() => setShowResume(true)} resumeDownloadUrl={resumeDownloadUrl} />
      </div>

      <div className="mt-auto pt-12 font-mono text-[10px] uppercase tracking-[0.5em] opacity-40 relative z-10">
        Arnav Raju • {new Date().getFullYear()}
      </div>

      <AnimatePresence>
        {showResume && (
          <div className="fixed inset-0 z-[100] bg-bg/90 backdrop-blur-sm flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
               className="w-full max-w-5xl h-[90vh] bg-zinc-200 border-2 border-fg shadow-[20px_20px_0px_0px_var(--fg)] flex flex-col overflow-hidden"
             >
                <div className="flex justify-between items-center p-4 border-b-2 border-fg bg-fg text-bg shrink-0">
                    <div className="flex items-center gap-3">
                        <FileText size={18} />
                        <span className="font-mono text-xs uppercase font-bold tracking-[0.2em]">Archive_Record: Arnav_Resume.pdf</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a 
                          href={resumeDownloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:bg-bg hover:text-fg px-4 py-2 rounded transition-colors font-mono text-[10px] font-bold uppercase border border-transparent hover:border-bg"
                        >
                            <Download size={14} /> DOWNLOAD PDF
                        </a>
                        <button 
                            onClick={() => setShowResume(false)} 
                            className="hover:bg-bg hover:text-fg p-2 rounded transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
                <div className="flex-1 bg-zinc-800 relative">
                    <iframe 
                        src={resumePreviewUrl}
                        className="w-full h-full border-none"
                        title="Resume Viewer"
                        allow="autoplay"
                    ></iframe>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Contact;