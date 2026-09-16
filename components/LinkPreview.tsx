
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
  previewImage?: string;
  className?: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ href, children, previewImage, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX + 20, y: e.clientY + 20 });
  };

  const Tooltip = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      style={{ 
        position: 'fixed', 
        left: mousePos.x, 
        top: mousePos.y,
        zIndex: 9999, // Ensure it's above everything
        pointerEvents: 'none'
      }}
      className="w-64 bg-bg border border-fg shadow-[8px_8px_0px_0px_var(--fg)] p-1 overflow-hidden hidden md:block"
    >
      <div className="aspect-video w-full overflow-hidden bg-fg/10 mb-2 flex items-center justify-center">
         {previewImage && !imageError ? (
           <img 
              src={previewImage} 
              alt="Preview" 
              className="w-full h-full object-cover" 
              onError={() => setImageError(true)}
           />
         ) : (
           <div className="font-mono text-xs opacity-50 flex items-center justify-center w-full h-full bg-fg/5">
             NO PREVIEW
           </div>
         )}
      </div>
      <div className="bg-fg text-bg px-2 py-1 text-[10px] font-mono uppercase truncate">
          {href.replace('https://', '')}
      </div>
    </motion.div>
  );

  return (
    <>
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative inline-flex items-center gap-1 group cursor-alias ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
        <ArrowUpRight size={12} className="opacity-50 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
      </a>

      <AnimatePresence>
        {isHovered && previewImage && ReactDOM.createPortal(Tooltip, document.body)}
      </AnimatePresence>
    </>
  );
};

export default LinkPreview;
