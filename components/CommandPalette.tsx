import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Search, Hash, Zap, Cpu, MessageSquare } from 'lucide-react';

const COMMANDS = [
  { id: 'nav-about', label: 'Go to About', icon: <Hash size={14} />, action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'nav-exp', label: 'Go to Experience', icon: <Hash size={14} />, action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'nav-proj', label: 'Go to Projects', icon: <Hash size={14} />, action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'theme-cycle', label: 'Cycle Theme', icon: <Cpu size={14} />, action: () => { /* Logic to cycle theme */ } }
];

const CommandPalette: React.FC<{ onCycleTheme: () => void }> = ({ onCycleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [isOpen]);

  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const runCommand = (cmd: typeof COMMANDS[0]) => {
    if (cmd.id === 'theme-cycle') onCycleTheme();
    else cmd.action();
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-0 bg-bg/60 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-xl bg-bg border-2 border-fg shadow-[20px_20px_0px_0px_var(--fg)] relative z-10 overflow-hidden"
          >
            <div className="flex items-center gap-4 p-4 border-b-2 border-fg">
              <Search className="opacity-40" size={18} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none font-mono text-sm uppercase tracking-widest placeholder:opacity-20"
              />
              <div className="hidden md:flex items-center gap-1 font-mono text-[10px] opacity-30">
                <span className="border border-fg/30 px-1 rounded">ESC</span>
                <span>to close</span>
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => runCommand(cmd)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-fg hover:text-bg transition-colors group text-left"
                  >
                    <span className="opacity-40 group-hover:opacity-100">{cmd.icon}</span>
                    <span className="font-mono text-xs uppercase font-bold flex-1">{cmd.label}</span>
                    <Zap size={12} className="opacity-0 group-hover:opacity-100" />
                  </button>
                ))
              ) : (
                <div className="p-8 text-center font-mono text-xs opacity-40 uppercase tracking-widest">
                  No command found for "{query}"
                </div>
              )}
            </div>

            <div className="p-3 bg-fg/5 border-t border-fg/10 flex justify-between items-center">
              <div className="flex items-center gap-2 font-mono text-[9px] opacity-40 uppercase">
                <Command size={10} />
                <span>Command Center v1.0.4</span>
              </div>
              <span className="font-mono text-[9px] opacity-20 uppercase tracking-tighter">Enter to Select</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;