import React, { useState, useEffect, useRef } from 'react';
import ScrambleText from './ScrambleText';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, X, Music, Grid3X3, Circle, X as XIcon, Cpu, Zap, Activity, Waves, Mic, Link as LinkIcon, AlertCircle, Eraser, Paintbrush, User, Bot, SlidersHorizontal, Settings2, Volume2, RotateCcw, Save, Trash2, RefreshCw } from 'lucide-react';

// --- RECTANGULAR MODAL COMPONENT ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-fg/30 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-7xl bg-bg border-2 border-fg shadow-[16px_16px_0px_0px_var(--fg)] flex flex-col h-[85vh] text-fg overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b-2 border-fg bg-fg text-bg shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-bg rounded-full animate-pulse" />
            <span className="font-mono text-sm font-bold uppercase tracking-wider">Module // {title}</span>
          </div>
          <button onClick={onClose} className="hover:bg-bg hover:text-fg transition-colors p-1 border border-transparent hover:border-bg">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden font-sans bg-bg relative">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// --- WAVEFORM ARCHITECT (TEKTRONIX 760A REDESIGN) ---
const WaveformArchitect = () => {
  const [mode, setMode] = useState<'SYNTH' | 'MIC' | 'SPOTIFY'>('SYNTH');
  const [freq, setFreq] = useState(440);
  const [amp, setAmp] = useState(0.5);
  const [type, setType] = useState<OscillatorType>('sine');
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBuffer, setRecordedBuffer] = useState<AudioBuffer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vuLevels, setVuLevels] = useState({ left: 0, right: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<OscillatorNode | AudioBufferSourceNode | MediaStreamAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (!analyserRef.current) {
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const stopAll = () => {
    setError(null);
    if (sourceRef.current) {
      try { sourceRef.current.disconnect(); } catch(e) {}
      try { (sourceRef.current as any).stop(); } catch(e) {}
      sourceRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
    if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    setIsProcessing(false);
    setVuLevels({ left: 0, right: 0 });
  };

  const startSynth = () => {
    initAudio();
    stopAll();
    const ctx = audioCtxRef.current!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(amp, ctx.currentTime);
    osc.connect(gain);
    gain.connect(analyserRef.current!);
    gain.connect(ctx.destination);
    osc.start();
    sourceRef.current = osc;
    gainRef.current = gain;
    draw();
    setIsProcessing(true);
  };

  const startMicRecording = async () => {
    initAudio();
    stopAll();
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/ogg; codecs=opus' });
        const arrayBuffer = await blob.arrayBuffer();
        audioCtxRef.current?.decodeAudioData(arrayBuffer, (buffer) => setRecordedBuffer(buffer));
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      setIsRecording(true);
      const source = audioCtxRef.current!.createMediaStreamSource(stream);
      source.connect(analyserRef.current!);
      sourceRef.current = source;
      draw();
    } catch (err) {
      setError("Microphone access denied.");
    }
  };

  const stopMicRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopAll();
    }
  };

  const playRecordedBuffer = () => {
    if (!recordedBuffer || !audioCtxRef.current) return;
    stopAll();
    const ctx = audioCtxRef.current;
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = recordedBuffer;
    source.loop = true;
    const pRate = (freq / 440); 
    source.playbackRate.setValueAtTime(pRate, ctx.currentTime);
    gain.gain.setValueAtTime(amp, ctx.currentTime);
    source.connect(gain);
    gain.connect(analyserRef.current!);
    gain.connect(ctx.destination);
    source.start();
    sourceRef.current = source;
    gainRef.current = gain;
    draw();
    setIsProcessing(true);
  };

  useEffect(() => {
    if (isProcessing && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      if (sourceRef.current instanceof OscillatorNode) {
        sourceRef.current.frequency.setTargetAtTime(freq, ctx.currentTime, 0.05);
        sourceRef.current.type = type;
      } else if (sourceRef.current instanceof AudioBufferSourceNode) {
        const pRate = (freq / 440);
        sourceRef.current.playbackRate.setTargetAtTime(pRate, ctx.currentTime, 0.05);
      }
      if (gainRef.current) gainRef.current.gain.setTargetAtTime(amp, ctx.currentTime, 0.05);
    }
  }, [freq, amp, type]);

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      animationIdRef.current = requestAnimationFrame(renderFrame);
      analyserRef.current!.getByteTimeDomainData(dataArray);
      
      // Calculate VU Level (root mean square)
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const val = (dataArray[i] - 128) / 128;
        sum += val * val;
      }
      const rms = Math.sqrt(sum / bufferLength);
      setVuLevels({ left: rms * 1.5, right: rms * 1.3 }); // Simulated stereo

      // Phosphor Green Effect
      ctx.fillStyle = '#051005';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw Grid
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
      ctx.lineWidth = 1;
      const step = canvas.width / 10;
      for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(i * step, 0); ctx.lineTo(i * step, canvas.height); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * (canvas.height / 8)); ctx.lineTo(canvas.width, i * (canvas.height / 8)); ctx.stroke();
      }

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#00ff41';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00ff41';
      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * (canvas.height / 2);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Scanlines overlay
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      for(let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 2);
      }
    };
    renderFrame();
  };

  useEffect(() => { return () => stopAll(); }, []);

  const LEDBar = ({ level }: { level: number }) => {
    const segments = 24;
    const active = Math.floor(level * segments);
    return (
      <div className="flex flex-col-reverse gap-[2px] h-full w-4 md:w-6 bg-black p-[2px] border border-zinc-700">
        {Array.from({ length: segments }).map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 ${i < active ? (i > 20 ? 'bg-red-500' : (i > 16 ? 'bg-yellow-400' : 'bg-lime-400')) : 'bg-zinc-900'} transition-colors duration-75`}
            style={{ boxShadow: i < active ? '0 0 5px currentColor' : 'none' }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="h-full w-full flex bg-[#1a1a1a] p-2 md:p-6 overflow-hidden">
      {/* Outer Case (Tektronix Style) */}
      <div className="flex-1 border-[10px] border-[#2c2c2c] rounded-md shadow-2xl flex flex-col md:flex-row bg-[#222]">
        
        {/* Left Section: Screen Area */}
        <div className="flex-[3] flex flex-col p-4 bg-[#282828] border-r-4 border-[#333]">
          
          {/* Top Controls Overlay */}
          <div className="flex justify-between items-center mb-4 px-2">
             <div className="flex gap-4">
                {['SYNTH', 'MIC', 'SPOTIFY'].map((m: any) => (
                  <button key={m} onClick={() => { setMode(m); stopAll(); }} className={`px-4 py-1 border-2 font-mono text-[9px] font-bold tracking-widest ${mode === m ? 'bg-[#00ff41] text-black border-[#00ff41]' : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-white transition-colors'}`}>
                    {m}
                  </button>
                ))}
             </div>
             <div className="font-mono text-[10px] text-zinc-500 tracking-tighter hidden md:block">TEKTRONIX_760A_STERO_MONITOR</div>
          </div>

          {/* CRT Screen Frame */}
          <div className="flex-1 relative border-[12px] border-[#3a3a3a] rounded-[20px] shadow-inner bg-black overflow-hidden flex items-center justify-center">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-10" />
            <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-cover" />
            
            {mode === 'SPOTIFY' && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
                <div className="border-4 border-red-600 p-6 transform -rotate-12 bg-black/60 shadow-lg">
                  <span className="text-red-600 font-mono text-3xl md:text-5xl font-black uppercase tracking-tighter animate-pulse drop-shadow-[0_0_10px_red]">UNDER CONSTRUCTION</span>
                </div>
              </div>
            )}
            
            {/* Control UI floating on screen edges */}
            <div className="absolute bottom-4 left-4 font-mono text-[9px] text-[#00ff41]/40 uppercase tracking-widest pointer-events-none z-10">
              {freq}Hz / {(amp * 100).toFixed(0)}% / {type.toUpperCase()}
            </div>
          </div>

          {/* Bottom Hard Knobs Panel */}
          <div className="h-20 flex items-center justify-center gap-12 border-t-2 border-[#1c1c1c] mt-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-[#3a3a3a] border-2 border-zinc-600 shadow-lg flex items-center justify-center">
                <div className="w-1 h-4 bg-zinc-300 transform -rotate-45" />
              </div>
              <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">Focus</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-[#3a3a3a] border-2 border-zinc-600 shadow-xl flex items-center justify-center">
                <div className="w-1 h-5 bg-zinc-200 transform rotate-12" />
              </div>
              <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">Position</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-[#3a3a3a] border-2 border-zinc-600 shadow-lg flex items-center justify-center">
                <div className="w-1 h-4 bg-zinc-300 transform rotate-[90deg]" />
              </div>
              <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">Trace</span>
            </div>
          </div>
        </div>

        {/* Right Section: Meters & Knobs */}
        <div className="flex-1 bg-[#222] p-4 flex flex-col gap-6 border-l-2 border-[#333]">
          
          {/* Meters Labeling */}
          <div className="flex justify-between items-end px-2">
            <div className="font-mono text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Left</div>
            <div className="font-mono text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Right</div>
          </div>

          {/* VU Meters Area */}
          <div className="flex-[2] bg-zinc-900 rounded-sm border-2 border-zinc-800 p-4 flex justify-around items-center relative">
             {/* Scale marks */}
             <div className="absolute left-1 top-4 bottom-4 flex flex-col justify-between font-mono text-[7px] text-zinc-600 font-bold">
               <span>+8</span><span>+4</span><span>0</span><span>-4</span><span>-8</span><span>-12</span><span>-16</span><span>-20</span><span>-30</span><span>-45</span>
             </div>
             <LEDBar level={vuLevels.left} />
             <LEDBar level={vuLevels.right} />
             <div className="absolute right-1 top-4 bottom-4 flex flex-col justify-between font-mono text-[7px] text-zinc-600 font-bold text-right">
               <span>dB</span><span>-5</span><span>-6</span><span>-7</span><span>-8</span><span>-9</span><span>-10</span><span>-11</span>
             </div>
          </div>

          {/* Mode Controls */}
          <div className="flex-[3] flex flex-col gap-4 bg-[#2a2a2a] p-4 rounded border border-[#333]">
            <AnimatePresence mode="wait">
              {mode === 'SYNTH' && (
                <motion.div key="synth-controls" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest">Freq_Select</label>
                    <input type="range" min="20" max="1500" value={freq} onChange={(e) => setFreq(parseInt(e.target.value))} className="w-full accent-[#00ff41] h-1" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest">Gain_dB</label>
                    <input type="range" min="0" max="1" step="0.01" value={amp} onChange={(e) => setAmp(parseFloat(e.target.value))} className="w-full accent-[#00ff41] h-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {['sine', 'square', 'sawtooth', 'triangle'].map((t: any) => (
                      <button key={t} onClick={() => setType(t)} className={`py-1 text-[8px] font-mono border ${type === t ? 'bg-[#00ff41] text-black border-[#00ff41]' : 'border-zinc-700 text-zinc-500'}`}>{t.toUpperCase()}</button>
                    ))}
                  </div>
                  <button onClick={isProcessing ? stopAll : startSynth} className={`w-full py-2 border-2 border-[#00ff41] font-mono text-[10px] font-black tracking-[0.2em] transition-all ${isProcessing ? 'bg-[#00ff41] text-black' : 'text-[#00ff41] hover:bg-[#00ff41]/10'}`}>
                    {isProcessing ? "DISCONNECT" : "CONNECT_POWER"}
                  </button>
                </motion.div>
              )}

              {mode === 'MIC' && (
                <motion.div key="mic-controls" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="bg-black/40 p-3 border border-zinc-700 text-center rounded flex flex-col items-center gap-2">
                    <Mic size={20} className={isRecording ? 'text-red-500 animate-pulse' : 'text-zinc-600'} />
                    <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">Acoustic_Input</span>
                  </div>
                  {!recordedBuffer ? (
                    <button onClick={isRecording ? stopMicRecording : startMicRecording} className={`w-full py-4 border-2 font-mono text-[10px] font-bold tracking-widest ${isRecording ? 'bg-red-600 border-red-600 text-white' : 'border-zinc-600 text-zinc-400 hover:text-white'}`}>
                      {isRecording ? "STOP_REC" : "INIT_REC"}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                         <button onClick={isProcessing ? stopAll : playRecordedBuffer} className={`flex-1 py-3 border-2 font-mono text-[10px] font-bold ${isProcessing ? 'bg-[#00ff41] border-[#00ff41] text-black' : 'border-[#00ff41] text-[#00ff41]'}`}>
                           {isProcessing ? "STOP" : "PLAYBACK"}
                         </button>
                         <button onClick={() => { stopAll(); setRecordedBuffer(null); }} className="p-3 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"><Trash2 size={16}/></button>
                      </div>
                      <input type="range" min="20" max="1500" value={freq} onChange={(e) => setFreq(parseInt(e.target.value))} className="w-full accent-[#00ff41]" />
                      <div className="text-center font-mono text-[7px] text-zinc-600 uppercase tracking-tighter italic">Rate: {(freq/440).toFixed(2)}x</div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Model Display Label */}
          <div className="mt-auto pt-4 border-t border-zinc-800 flex justify-between items-center px-2">
             <div className="flex flex-col">
                <span className="font-mono text-[10px] text-zinc-300 font-bold tracking-tighter">760A</span>
                <span className="font-mono text-[6px] text-zinc-500 font-bold uppercase">Stereo Audio Monitor</span>
             </div>
             <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_5px_yellow] animate-pulse" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MINI DAW (THE SEQUENCER) ---
const MiniDAW = () => {
  const STEPS = 32;
  const TRACKS = 8;
  const TRACK_NAMES = ['Kick', 'Snare', 'Hat', 'Perc', 'Bass', 'Lead', 'Pad', 'Fx'];
  
  // Base frequencies for instruments in each pack
  const PACKS = {
    'NEURAL': [45, 180, 8000, 1200, 42, 440, 220, 1000],
    'PULSE': [55, 220, 10000, 1500, 55, 330, 110, 1500],
    'GLITCH': [35, 300, 12000, 2000, 32, 880, 550, 3000]
  };

  const [grid, setGrid] = useState<boolean[][]>(Array(TRACKS).fill(null).map(() => Array(STEPS).fill(false)));
  const [trackSettings, setTrackSettings] = useState<{freq: number}[]>(
    Array(TRACKS).fill(null).map((_, i) => ({ freq: PACKS.NEURAL[i] }))
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [bpm, setBpm] = useState(124);
  const [activePack, setActivePack] = useState<keyof typeof PACKS>('NEURAL');
  
  const audioCtx = useRef<AudioContext | null>(null);
  const timer = useRef<number | null>(null);
  const noiseBuffer = useRef<AudioBuffer | null>(null);

  const initAudio = () => {
    if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        // Create a reusable noise buffer for snares and hats
        const bufferSize = audioCtx.current.sampleRate * 2.0;
        const buffer = audioCtx.current.createBuffer(1, bufferSize, audioCtx.current.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        noiseBuffer.current = buffer;
    }
    if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
  };

  const playInstrument = (idx: number) => {
    if (!audioCtx.current || !noiseBuffer.current) return;
    const ctx = audioCtx.current;
    const time = ctx.currentTime;
    const { freq } = trackSettings[idx];
    const name = TRACK_NAMES[idx].toLowerCase();

    // 1. Kick: Bass drum with pitch sweep
    if (name === 'kick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq * 3, time);
      osc.frequency.exponentialRampToValueAtTime(freq, time + 0.15);
      gain.gain.setValueAtTime(1, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.3);
    } 
    // 2. Snare: Filtered noise + body tone
    else if (name === 'snare') {
      // Body tone
      const osc = ctx.createOscillator();
      const oGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, time);
      oGain.gain.setValueAtTime(0.4, time);
      oGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      osc.connect(oGain);
      oGain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.1);

      // Snare "snap" noise
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer.current;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1000, time);
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.6, time);
      nGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
      noise.connect(noiseFilter);
      noiseFilter.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(time);
      noise.stop(time + 0.2);
    }
    // 3. Hat: Crisp high-frequency noise
    else if (name === 'hat') {
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer.current;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(freq, time); // e.g. 8000Hz
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.3, time);
      nGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
      noise.connect(noiseFilter);
      noiseFilter.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(time);
      noise.stop(time + 0.05);
    }
    // 4. Perc: Metallic "click" or woodblock
    else if (name === 'perc') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * 2, time);
      osc.frequency.exponentialRampToValueAtTime(freq, time + 0.05);
      gain.gain.setValueAtTime(0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.08);
    }
    // 5. Bass: Solid low sub
    else if (name === 'bass') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.6, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.4);
    }
    // 6. Lead: Plucky synthesizer
    else if (name === 'lead') {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 4, time);
      filter.frequency.exponentialRampToValueAtTime(freq, time + 0.2);
      filter.Q.value = 5;

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.2);
    }
    // 7. Pad: Atmospheric harmony
    else if (name === 'pad') {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, time);
      filter.frequency.linearRampToValueAtTime(freq * 2, time + 0.5);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.2, time + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.8);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.8);
    }
    // 8. FX: Risers / Sweeps
    else if (name === 'fx') {
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer.current;
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(200, time);
      filter.frequency.exponentialRampToValueAtTime(freq * 5, time + 0.6);
      filter.Q.value = 10;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.3, time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.6);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      noise.start(time);
      noise.stop(time + 0.6);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      if (timer.current) clearInterval(timer.current);
      const interval = (60 / bpm) * 1000 / 4;
      timer.current = window.setInterval(() => {
        setCurrentStep(prev => {
          const next = (prev + 1) % STEPS;
          grid.forEach((track, i) => { if (track[next]) playInstrument(i); });
          return next;
        });
      }, interval);
    } else {
      if (timer.current) clearInterval(timer.current);
      setCurrentStep(-1);
    }
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [isPlaying, bpm, grid, trackSettings]);

  const switchPack = (pack: keyof typeof PACKS) => {
    setActivePack(pack);
    setTrackSettings(prev => prev.map((s, i) => ({ ...s, freq: PACKS[pack][i] })));
  };

  return (
    <div className="h-full flex flex-col bg-bg">
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-fg bg-fg/5">
        <div className="flex items-center gap-6">
          <button onClick={() => { initAudio(); setIsPlaying(!isPlaying); }} className={`w-12 h-12 rounded-full border-2 border-fg flex items-center justify-center transition-all ${isPlaying ? 'bg-fg text-bg' : 'hover:bg-fg/10'}`}>
            {isPlaying ? <Square size={18} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <div className="flex flex-col">
            <span className="font-mono text-[9px] uppercase opacity-40">Global Tempo</span>
            <div className="flex items-center gap-3">
              <input type="range" min="40" max="220" value={bpm} onChange={(e) => setBpm(parseInt(e.target.value))} className="w-32 accent-fg" />
              <span className="font-mono text-sm font-bold w-16">{bpm} BPM</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           {Object.keys(PACKS).map((p: any) => (
             <button key={p} onClick={() => switchPack(p)} className={`px-4 py-2 border font-mono text-[10px] uppercase font-bold transition-all ${activePack === p ? 'bg-fg text-bg' : 'border-fg/20 hover:border-fg'}`}>{p}_CORE</button>
           ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-56 border-r border-fg shrink-0 flex flex-col overflow-y-auto custom-scrollbar bg-fg/5">
           {TRACK_NAMES.map((name, i) => (
             <div key={i} className="h-16 border-b border-fg/10 px-4 flex flex-col justify-center gap-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[10px] font-bold opacity-60">{name.toUpperCase()}</span>
                  <button 
                    onClick={() => { initAudio(); playInstrument(i); }} 
                    className="p-1 border border-fg/20 rounded hover:bg-fg/10 transition-colors"
                    title="Audit Sound"
                  >
                    <Volume2 size={10} />
                  </button>
                </div>
                <input type="range" min="20" max="15000" value={trackSettings[i].freq} onChange={(e) => {
                  const next = [...trackSettings];
                  next[i].freq = parseInt(e.target.value);
                  setTrackSettings(next);
                }} className="w-full h-1 accent-fg bg-fg/10 appearance-none rounded" />
             </div>
           ))}
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar relative">
          <div className="flex flex-col min-w-max">
            {grid.map((track, trackIdx) => (
              <div key={trackIdx} className="h-16 border-b border-fg/10 flex">
                {track.map((active, stepIdx) => (
                  <button
                    key={stepIdx}
                    onClick={() => {
                      initAudio();
                      const n = [...grid];
                      n[trackIdx][stepIdx] = !active;
                      setGrid(n);
                    }}
                    className={`w-12 md:w-16 border-r border-fg/10 transition-all relative ${active ? 'bg-fg scale-90 rounded' : 'hover:bg-fg/5'} ${stepIdx % 4 === 0 ? 'bg-fg/[0.03]' : ''}`}
                  >
                    {currentStep === stepIdx && (
                      <div className="absolute inset-0 bg-fg/20 animate-pulse pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-fg shadow-[0_0_10px_var(--fg)] z-10 transition-all duration-75 pointer-events-none"
            style={{ 
              left: currentStep === -1 ? -10 : `calc(${currentStep} * ${window.innerWidth < 768 ? '48px' : '64px'})`,
              display: isPlaying ? 'block' : 'none' 
            }}
          />
        </div>
      </div>
    </div>
  );
};

// --- TIC TAC TOE (VS AI) ---
const TicTacToe = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [mode, setMode] = useState<'PVP' | 'AI'>('AI');

  const checkWinner = (sq: (string | null)[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(let l of lines) if(sq[l[0]] && sq[l[0]] === sq[l[1]] && sq[l[0]] === sq[l[2]]) return sq[l[0]];
    return sq.includes(null) ? null : 'Draw';
  };

  const getBestMove = (sq: (string | null)[]) => {
    const avail = sq.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
    if(avail.length === 0) return null;
    for(let m of avail) { const c = [...sq]; c[m] = 'O'; if(checkWinner(c) === 'O') return m; }
    for(let m of avail) { const c = [...sq]; c[m] = 'X'; if(checkWinner(c) === 'X') return m; }
    if(sq[4] === null) return 4;
    return avail[Math.floor(Math.random() * avail.length)];
  };

  useEffect(() => {
    if(mode === 'AI' && !xIsNext && !winner) {
      const timer = setTimeout(() => {
        const move = getBestMove(board);
        if(move !== null) makeMove(move);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, board, winner, mode]);

  const makeMove = (i: number) => {
    if(board[i] || winner) return;
    const n = [...board];
    n[i] = xIsNext ? 'X' : 'O';
    setBoard(n);
    setXIsNext(!xIsNext);
    setWinner(checkWinner(n));
  };

  const reset = () => { setBoard(Array(9).fill(null)); setXIsNext(true); setWinner(null); };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-bg">
      <div className="mb-10 text-center">
        <h3 className="font-serif text-4xl italic mb-4">Neural Matchup</h3>
        <div className="flex gap-4 justify-center mb-6">
          <button onClick={() => { setMode('PVP'); reset(); }} className={`px-4 py-1 border font-mono text-[10px] ${mode === 'PVP' ? 'bg-fg text-bg' : 'opacity-40'}`}>FRIENDLY</button>
          <button onClick={() => { setMode('AI'); reset(); }} className={`px-4 py-1 border font-mono text-[10px] ${mode === 'AI' ? 'bg-fg text-bg' : 'opacity-40'}`}>VS_BOT</button>
        </div>
        <p className="font-mono text-xs uppercase tracking-widest opacity-50">
          {winner ? (winner === 'Draw' ? "STATUS: STALEMATE" : `RESULT: ${winner} DOMINANCE`) : `CURRENT: ${xIsNext ? 'PLAYER_1 (X)' : (mode === 'AI' ? 'COMPUTING...' : 'PLAYER_2 (O)')}`}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 border-2 border-fg p-3 shadow-[12px_12px_0px_0px_var(--fg)] bg-fg/5">
        {board.map((cell, i) => (
          <button key={i} onClick={() => makeMove(i)} className="w-24 h-24 md:w-32 md:h-32 border border-fg/20 flex items-center justify-center hover:bg-fg/10 transition-all bg-bg text-4xl font-serif">
            {cell === 'X' && <XIcon size={48} className="text-fg" />}
            {cell === 'O' && <Circle size={48} className="text-fg" />}
          </button>
        ))}
      </div>
      <button onClick={reset} className="mt-12 px-12 py-4 border-2 border-fg font-mono text-xs font-bold uppercase hover:bg-fg hover:text-bg transition-all tracking-widest shadow-[6px_6px_0px_0px_var(--fg)] hover:shadow-none translate-x-[-3px] translate-y-[-3px] hover:translate-x-0 hover:translate-y-0">REBOOT_SYSTEM</button>
    </div>
  );
};

// --- PIXEL PAD (WITH ERASER) ---
const PixelGrid = () => {
  const [grid, setGrid] = useState(Array(1024).fill(false));
  const [tool, setTool] = useState<'DRAW' | 'ERASE'>('DRAW');
  const isDragging = useRef(false);

  const paint = (i: number) => {
    const n = [...grid];
    n[i] = tool === 'DRAW';
    setGrid(n);
  };

  return (
    <div className="h-full flex flex-col items-center p-8 bg-bg overflow-hidden">
      <div className="mb-8 text-center shrink-0">
        <h3 className="font-serif text-3xl italic mb-4">Pixel Buffer</h3>
        <div className="flex gap-4 justify-center">
          <button onClick={() => setTool('DRAW')} className={`p-3 border-2 ${tool === 'DRAW' ? 'bg-fg text-bg border-fg' : 'border-fg/20 opacity-40 hover:opacity-100'}`}><Paintbrush size={20} /></button>
          <button onClick={() => setTool('ERASE')} className={`p-3 border-2 ${tool === 'ERASE' ? 'bg-fg text-bg border-fg' : 'border-fg/20 opacity-40 hover:opacity-100'}`}><Eraser size={20} /></button>
          <button onClick={() => setGrid(Array(1024).fill(false))} className="p-3 border-2 border-fg/20 opacity-40 hover:opacity-100 hover:bg-red-500/10"><RotateCcw size={20} /></button>
        </div>
      </div>
      <div 
        className={`flex-1 w-full grid grid-cols-32 gap-px bg-fg/10 border-2 border-fg shadow-[16px_16px_0px_0px_var(--fg)] max-w-5xl overflow-hidden ${tool === 'ERASE' ? 'cursor-alias' : 'cursor-crosshair'}`}
        style={{ gridTemplateColumns: 'repeat(32, 1fr)' }}
        onMouseDown={() => { isDragging.current = true; }}
        onMouseUp={() => { isDragging.current = false; }}
        onMouseLeave={() => { isDragging.current = false; }}
      >
        {grid.map((active, i) => (
          <div key={i} onMouseEnter={() => isDragging.current && paint(i)} onMouseDown={() => paint(i)} className={`aspect-square transition-colors ${active ? 'bg-fg' : 'bg-bg hover:bg-fg/5'}`} />
        ))}
      </div>
      <div className="mt-6 font-mono text-[9px] uppercase opacity-40">Drag to sequence fragments</div>
    </div>
  );
};

// --- MAIN PLAYGROUND SECTION ---
const Fun: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const cards = [
    { id: 'tictactoe', title: 'Tactics_AI', icon: <Grid3X3 size={32} /> },
    { id: 'pixelpad', title: 'Visual_Buffer', icon: <Square size={32} /> },
    { id: 'minidaw', title: 'Studio_Module', icon: <Music size={32} /> },
    { id: 'waves', title: 'Architect_FX', icon: <Waves size={32} /> },
  ];

  return (
    <section id="fun" className="grid grid-cols-1 md:grid-cols-4 bg-bg">
      <div className="p-8 border-b md:border-b-0 md:border-r border-fg flex flex-col justify-center bg-fg/5">
         <h2 className="text-4xl font-serif italic mb-2"><ScrambleText text="Playground" /></h2>
         <p className="font-mono text-[10px] uppercase opacity-50 tracking-widest leading-relaxed">Interactive systems for neural relaxation and creative experimentation.</p>
      </div>
      <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setActiveGame(card.id)}
            className="aspect-square flex flex-col items-center justify-center gap-6 border-r border-b border-fg hover-invert group last:border-r-0 transition-all duration-500"
          >
             <div className="group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">{card.icon}</div>
             <span className="font-mono text-[10px] uppercase tracking-widest font-bold opacity-60 group-hover:opacity-100">{card.title}</span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {activeGame && (
          <Modal isOpen={!!activeGame} onClose={() => setActiveGame(null)} title={cards.find(c => c.id === activeGame)?.title || ''}>
            {activeGame === 'tictactoe' && <TicTacToe />}
            {activeGame === 'pixelpad' && <PixelGrid />}
            {activeGame === 'minidaw' && <MiniDAW />}
            {activeGame === 'waves' && <WaveformArchitect />}
          </Modal>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Fun;