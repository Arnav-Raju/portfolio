import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Activity } from 'lucide-react';

interface AudioVisualizerProps {
  src: string;
  title: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ src, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Audio Context on first play (browser policy)
  const initAudio = () => {
    if (isInitialized) return;

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    
    // Configure analyser for oscilloscope
    analyser.fftSize = 2048;
    
    if (audioRef.current) {
      const source = audioCtx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      sourceRef.current = source;
    }

    audioContextRef.current = audioCtx;
    analyserRef.current = analyser;
    setIsInitialized(true);
  };

  useEffect(() => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      // Use parent container dimensions
      const width = containerRef.current?.clientWidth || canvas.width;
      const height = containerRef.current?.clientHeight || canvas.height;
      
      canvas.width = width;
      canvas.height = height;

      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      // Brutalist styling: solid background, sharp foreground
      const computedStyle = getComputedStyle(document.body);
      const bgColor = computedStyle.getPropertyValue('--bg').trim() || '#ffffff';
      const fgColor = computedStyle.getPropertyValue('--fg').trim() || '#000000';
      
      // Dynamic accent color: defaults to neon pink, but if background is red/pink, flip to cyan
      let waveformColor = '#ff3366';
      const hex = bgColor.replace('#', '').trim();
      if (hex.length === 6 || hex.length === 3) {
        const r = parseInt(hex.length === 3 ? hex[0]+hex[0] : hex.substring(0,2), 16);
        const g = parseInt(hex.length === 3 ? hex[1]+hex[1] : hex.substring(2,4), 16);
        
        // If background is highly red/pink-dominant (high Red, low Green)
        if (r > 150 && g < 150) {
          waveformColor = '#00f0ff'; // Vibrant cyan
        }
      }

      // Propagate the safe accent color to CSS variables for the shadow and icons
      if (wrapperRef.current) {
        wrapperRef.current.style.setProperty('--viz-accent', waveformColor);
      }

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.lineWidth = 1;
      ctx.strokeStyle = `${fgColor}20`; // 20% opacity
      ctx.beginPath();
      for (let i = 0; i < width; i += 20) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
      }
      for (let i = 0; i < height; i += 20) {
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
      }
      ctx.stroke();

      // Draw oscilloscope waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = isPlaying ? waveformColor : fgColor;
      ctx.beginPath();

      const sliceWidth = width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // 0 to 2
        const y = v * height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInitialized, isPlaying]);

  const togglePlay = () => {
    if (!isInitialized) {
      initAudio();
    }

    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div ref={wrapperRef} className="flex flex-col w-full border-2 border-fg bg-bg shadow-[8px_8px_0px_0px_var(--viz-accent,#ff3366)] overflow-hidden transition-shadow">
      {/* Header bar */}
      <div className="flex items-center justify-between p-3 border-b-2 border-fg bg-fg text-bg">
        <div className="flex items-center gap-2">
          <Activity size={16} className={isPlaying ? 'animate-pulse text-[var(--viz-accent,#ff3366)]' : ''} />
          <span className="font-mono text-xs font-bold uppercase tracking-widest truncate max-w-[200px]">
            {title}
          </span>
        </div>
        <span className="font-mono text-[10px] opacity-70">OSC_VISUALIZER.exe</span>
      </div>

      {/* Canvas Area */}
      <div ref={containerRef} className="relative w-full h-40 cursor-crosshair bg-bg">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full block" 
        />
        {!isInitialized && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-mono text-xs uppercase tracking-widest bg-bg px-2 py-1 border border-fg animate-pulse">
              Awaiting Signal
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between p-3 border-t-2 border-fg bg-bg">
        <button 
          onClick={togglePlay}
          className="flex items-center gap-2 font-mono text-xs uppercase font-bold hover:text-[var(--viz-accent,#ff3366)] transition-colors"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Pause' : 'Initialize Playback'}
        </button>

        <button 
          onClick={toggleMute}
          className="hover:text-[var(--viz-accent,#ff3366)] transition-colors"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      <audio 
        ref={audioRef} 
        src={src} 
        crossOrigin="anonymous" 
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default AudioVisualizer;
