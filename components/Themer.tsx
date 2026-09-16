import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Type, Check, RefreshCw, ChevronDown } from 'lucide-react';
import { CustomThemeConfig } from '../types';

interface ThemerProps {
  isOpen: boolean;
  onClose: () => void;
  config: CustomThemeConfig;
  onUpdate: (config: CustomThemeConfig) => void;
}

const FONTS_LIST = {
  primary: [
    { name: 'Space Mono', value: "'Space Mono', monospace" },
    { name: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
    { name: 'Fira Code', value: "'Fira Code', monospace" },
    { name: 'IBM Plex Mono', value: "'IBM Plex Mono', monospace" },
  ],
  secondary: [
    { name: 'Playfair Display', value: "'Playfair Display', serif" },
    { name: 'Cormorant Garamond', value: "'Cormorant Garamond', serif" },
    { name: 'Lora', value: "'Lora', serif" },
    { name: 'Georgia', value: "Georgia, serif" }
  ],
  tertiary: [
    { name: 'Space Grotesk', value: "'Space Grotesk', sans-serif" },
    { name: 'Outfit', value: "'Outfit', sans-serif" },
    { name: 'Inter', value: "'Inter', sans-serif" },
    { name: 'IBM Plex Sans', value: "'IBM Plex Sans', sans-serif" },
    { name: 'System Default', value: "system-ui, sans-serif" }
  ]
};

const FontSelector: React.FC<{
  label: string;
  value: string;
  options: { name: string; value: string }[];
  onChange: (val: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div className="space-y-3">
    <label className="font-mono text-[10px] uppercase font-bold text-fg/60 tracking-widest">{label}</label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`p-3 text-left border-2 transition-all flex flex-col gap-1 ${
            value === opt.value 
              ? 'border-accent bg-accent/5' 
              : 'border-fg/10 bg-bg hover:border-fg/30'
          }`}
        >
          <span className="font-mono text-[8px] uppercase opacity-40 leading-none">Typeface</span>
          <span style={{ fontFamily: opt.value }} className="text-sm truncate">
            {opt.name}
          </span>
          {value === opt.value && <div className="h-1 w-full bg-accent mt-1" />}
        </button>
      ))}
    </div>
  </div>
);

const Themer: React.FC<ThemerProps> = ({ isOpen, onClose, config, onUpdate }) => {
  const handleChange = (key: keyof CustomThemeConfig, value: string) => {
    onUpdate({ ...config, [key]: value });
  };

  const handleReset = () => {
    onUpdate({
      primaryColor: '#ffffff',
      secondaryColor: '#000000',
      tertiaryColor: '#470ff4',
      primaryFont: "'Space Mono', monospace",
      secondaryFont: "'Playfair Display', serif",
      tertiaryFont: "'Space Mono', monospace"
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-fg/20 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="w-full max-w-2xl bg-bg border-2 border-fg shadow-[16px_16px_0px_0px_var(--fg)] relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b-2 border-fg bg-fg text-bg shrink-0">
              <div className="flex items-center gap-3">
                <Palette size={18} />
                <span className="font-mono text-xs font-bold uppercase tracking-widest">Theme_Architect_Core</span>
              </div>
              <button onClick={onClose} className="hover:bg-bg hover:text-fg transition-colors p-1 border border-transparent hover:border-bg">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 md:p-8 space-y-10 overflow-y-auto custom-scrollbar">
              
              {/* Colors Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-fg/10 pb-2">
                  <Palette size={14} className="opacity-40" />
                  <h3 className="font-mono text-[11px] uppercase font-black tracking-widest">Color parameters</h3>
                </div>
                
                <div className="space-y-8">
                  {/* Primary Color */}
                  <div className="group">
                    <div className="flex justify-between items-end mb-2">
                      <label className="font-mono text-[10px] uppercase font-bold text-fg/80">01. Primary_BG</label>
                      <span className="font-mono text-[8px] opacity-40 italic">Affects: Main Backgrounds</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 border-2 border-fg shrink-0 relative overflow-hidden">
                         <input 
                           type="color" 
                           value={config.primaryColor} 
                           onChange={(e) => handleChange('primaryColor', e.target.value)}
                           className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                         />
                      </div>
                      <input 
                        type="text" 
                        value={config.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="flex-1 font-mono text-sm bg-bg border-2 border-fg/10 p-4 uppercase outline-none focus:border-fg transition-all"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="group">
                    <div className="flex justify-between items-end mb-2">
                      <label className="font-mono text-[10px] uppercase font-bold text-fg/80">02. Secondary_FG</label>
                      <span className="font-mono text-[8px] opacity-40 italic">Affects: Text, Borders, Grids</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 border-2 border-fg shrink-0 relative overflow-hidden">
                         <input 
                           type="color" 
                           value={config.secondaryColor} 
                           onChange={(e) => handleChange('secondaryColor', e.target.value)}
                           className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                         />
                      </div>
                      <input 
                        type="text" 
                        value={config.secondaryColor}
                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                        className="flex-1 font-mono text-sm bg-bg border-2 border-fg/10 p-4 uppercase outline-none focus:border-fg transition-all"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  {/* Tertiary Color */}
                  <div className="group">
                    <div className="flex justify-between items-end mb-2">
                      <label className="font-mono text-[10px] uppercase font-bold text-accent">03. Tertiary_Accent</label>
                      <span className="font-mono text-[8px] opacity-40 italic">Affects: Buttons, Icons, Interactive elements</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 border-2 border-accent shrink-0 relative overflow-hidden shadow-[4px_4px_0px_0px_var(--accent)]">
                         <input 
                           type="color" 
                           value={config.tertiaryColor} 
                           onChange={(e) => handleChange('tertiaryColor', e.target.value)}
                           className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                         />
                      </div>
                      <input 
                        type="text" 
                        value={config.tertiaryColor}
                        onChange={(e) => handleChange('tertiaryColor', e.target.value)}
                        className="flex-1 font-mono text-sm bg-bg border-2 border-accent/20 p-4 uppercase outline-none focus:border-accent transition-all text-accent font-bold"
                        placeholder="#470FF4"
                      />
                    </div>
                    <div className="mt-2 p-2 bg-accent/5 border border-accent/10 flex items-center gap-2">
                       <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                       <p className="font-mono text-[8px] uppercase text-accent/80 font-bold">This color is now applied sitewide to highlights and interactive components.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography Section */}
              <div className="space-y-6 pt-6 border-t-2 border-fg/10">
                <div className="flex items-center gap-3 border-b border-fg/10 pb-2">
                  <Type size={14} className="opacity-40" />
                  <h3 className="font-mono text-[11px] uppercase font-black tracking-widest">Typographic Core</h3>
                </div>
                
                <div className="space-y-10">
                  <FontSelector 
                    label="UI / Monospace Interface" 
                    value={config.primaryFont}
                    options={FONTS_LIST.primary}
                    onChange={(val) => handleChange('primaryFont', val)}
                  />
                  <FontSelector 
                    label="Editorial / Display Headings" 
                    value={config.secondaryFont}
                    options={FONTS_LIST.secondary}
                    onChange={(val) => handleChange('secondaryFont', val)}
                  />
                  <FontSelector 
                    label="Functional / Body Sans" 
                    value={config.tertiaryFont}
                    options={FONTS_LIST.tertiary}
                    onChange={(val) => handleChange('tertiaryFont', val)}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t-2 border-fg bg-fg/5 flex gap-3 shrink-0">
              <button 
                onClick={onClose}
                className="flex-1 py-4 bg-accent text-bg font-mono text-[11px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[8px_8px_0px_0px_var(--fg)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <Check size={16} /> Deploy Architecture
              </button>
              <button 
                onClick={handleReset}
                className="w-14 h-14 border-2 border-fg flex items-center justify-center hover:bg-fg hover:text-bg transition-colors"
                title="Reset to Factory"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Themer;