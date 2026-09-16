import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Terminal, Download, Mail, Eye } from 'lucide-react';

interface HistoryLine {
  type: 'input' | 'output' | 'system' | 'error';
  text: React.ReactNode;
}

interface TerminalContactProps {
  onOpenResume: () => void;
  resumeDownloadUrl: string;
}

const TerminalContact: React.FC<TerminalContactProps> = ({ onOpenResume, resumeDownloadUrl }) => {
  const [history, setHistory] = useState<HistoryLine[]>([
    { type: 'system', text: 'Welcome to ArnavOS v1.0.0.' },
    { type: 'system', text: 'Type "help" to see available commands.' }
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setHistory(prev => [...prev, { type: 'input', text: trimmedCmd }]);
    const args = trimmedCmd.toLowerCase().split(' ').filter(Boolean);

    switch (args[0]) {
      case 'help':
        setHistory(prev => [...prev, { type: 'output', text: (
          <div className="flex flex-col gap-1">
            <span>Available commands:</span>
            <span>  <span className="text-[#00ff41]">npm run contact</span> - Initialize contact protocol</span>
            <span>  <span className="text-[#00ff41]">mail --send</span>     - Open email client to send a message</span>
            <span>  <span className="text-[#00ff41]">resume view</span>     - Open the resume viewer</span>
            <span>  <span className="text-[#00ff41]">resume dl</span>       - Download resume PDF</span>
            <span>  <span className="text-[#00ff41]">clear</span>           - Clear terminal output</span>
            <span>  <span className="text-[#00ff41]">whoami</span>          - Display current user</span>
            <span>  <span className="text-[#00ff41]">echo [text]</span>     - Print text to terminal</span>
          </div>
        ) }]);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'whoami':
        setHistory(prev => [...prev, { type: 'output', text: 'guest_user' }]);
        break;
      case 'echo':
        setHistory(prev => [...prev, { type: 'output', text: trimmedCmd.slice(5) }]);
        break;
      case 'npm':
        if (args[1] === 'run' && args[2] === 'contact') {
          setHistory(prev => [...prev, { type: 'output', text: 'Initializing contact protocol...' }]);
          setTimeout(() => {
            window.open('https://mail.google.com/mail/?view=cm&fs=1&to=arnavpenumetcha123@gmail.com', '_blank');
            setHistory(prev => [...prev, { type: 'system', text: 'Contact protocol successful. Email client opened.' }]);
          }, 800);
        } else {
          setHistory(prev => [...prev, { type: 'error', text: `npm ERR! missing script: ${args.slice(1).join(' ')}` }]);
        }
        break;
      case 'mail':
        if (args[1] === '--send') {
          setHistory(prev => [...prev, { type: 'output', text: 'Opening mail client...' }]);
          setTimeout(() => {
            window.open('https://mail.google.com/mail/?view=cm&fs=1&to=arnavpenumetcha123@gmail.com', '_blank');
            setHistory(prev => [...prev, { type: 'system', text: 'Mail client opened.' }]);
          }, 800);
        } else {
          setHistory(prev => [...prev, { type: 'error', text: 'mail: missing or invalid flag. Try mail --send' }]);
        }
        break;
      case 'resume':
        if (args[1] === 'view') {
          setHistory(prev => [...prev, { type: 'output', text: 'Opening resume viewer...' }]);
          setTimeout(() => {
            onOpenResume();
          }, 500);
        } else if (args[1] === 'dl' || args[1] === 'download') {
          setHistory(prev => [...prev, { type: 'output', text: 'Initiating resume download...' }]);
          setTimeout(() => {
            window.open(resumeDownloadUrl, '_blank');
          }, 500);
        } else {
          setHistory(prev => [...prev, { type: 'error', text: 'resume: command not found. Try resume view or resume dl' }]);
        }
        break;
      default:
        setHistory(prev => [...prev, { type: 'error', text: `Command not found: ${args[0]}. Type 'help' for a list of commands.` }]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div 
      className="w-full max-w-3xl mx-auto bg-[#0a0a0a] text-[#00ff41] font-mono text-sm sm:text-base border-2 border-fg shadow-[10px_10px_0px_0px_var(--fg)] text-left rounded-sm overflow-hidden flex flex-col"
      style={{ height: '400px' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="bg-fg text-bg px-4 py-2 flex items-center gap-3 shrink-0">
        <Terminal size={16} />
        <span className="uppercase tracking-widest font-bold text-xs">Guest@Arnav_Terminal ~</span>
      </div>

      {/* Terminal Body */}
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2" ref={containerRef}>
        {history.map((line, idx) => (
          <div key={idx} className="flex gap-2">
            {line.type === 'input' && <span className="text-[#ff003c] shrink-0">{'>'}</span>}
            {line.type === 'system' && <span className="text-gray-400 shrink-0">[*]</span>}
            {line.type === 'error' && <span className="text-red-500 shrink-0">[!]</span>}
            <div className={`whitespace-pre-wrap ${line.type === 'error' ? 'text-red-500' : line.type === 'system' ? 'text-gray-400' : 'text-[#00ff41]'}`}>
              {line.text}
            </div>
          </div>
        ))}
        
        {/* Active Input Line */}
        <div className="flex gap-2 items-center mt-2">
          <span className="text-[#ff003c] shrink-0">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-[#00ff41] font-mono p-0 m-0 caret-[#00ff41]"
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalContact;
