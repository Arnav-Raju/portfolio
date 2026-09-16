import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

const CursorTrail: React.FC<{ mouseX: any, mouseY: any }> = ({ mouseX, mouseY }) => {
  const numDots = 12; // Increased for longer trail
  const dots = Array.from({ length: numDots });

  return (
    <>
      {dots.map((_, i) => (
        <TrailingDot 
          key={i} 
          index={i} 
          mouseX={mouseX} 
          mouseY={mouseY} 
          total={numDots}
        />
      ))}
    </>
  );
};

const TrailingDot: React.FC<{ index: number, mouseX: any, mouseY: any, total: number }> = ({ index, mouseX, mouseY, total }) => {
  const size = (1 - index / total) * 6;
  const opacity = (1 - index / total) * 0.3;
  
  // Smoother, laggier trail for a "liquid" feel
  const x = useSpring(mouseX, { damping: 40 + index * 2, stiffness: 300 - index * 15 });
  const y = useSpring(mouseY, { damping: 40 + index * 2, stiffness: 300 - index * 15 });

  return (
    <motion.div
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        opacity: opacity,
        x: "-50%",
        y: "-50%",
      }}
      className="absolute bg-fg mix-blend-difference rounded-full pointer-events-none"
    />
  );
};

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, [role="button"]');
      const section = target.closest('section');
      
      if (clickable) {
        setIsHovering(true);
        if (section?.id === 'projects') setCursorText("SOURCE");
        else if (section?.id === 'music') setCursorText("PLAY");
        else if (section?.id === 'skills') setCursorText("STACK");
        else if (section?.id === 'fun') setCursorText("PLAY");
        else setCursorText("");
      } else {
        setIsHovering(false);
        setCursorText("");
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Dynamic Trail */}
      <CursorTrail mouseX={mouseX} mouseY={mouseY} />

      {/* Outer Ring */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          width: isHovering ? 90 : 32,
          height: isHovering ? 90 : 32,
          backgroundColor: isHovering ? "rgba(var(--fg-rgb), 0.1)" : "transparent",
        }}
        className="absolute border border-fg mix-blend-difference rounded-full flex items-center justify-center overflow-hidden transition-colors"
      >
        <AnimatePresence>
          {isHovering && cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              // Explicitly use non-blend colors for the text so it's always readable
              className="text-[10px] font-mono font-bold bg-fg text-bg px-2 py-0.5 tracking-[0.2em] uppercase mix-blend-normal"
            >
              {cursorText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        style={{
          left: mouseX,
          top: mouseY,
          x: "-50%",
          y: "-50%",
        }}
        className="absolute w-1.5 h-1.5 bg-fg mix-blend-difference rounded-full"
      />
    </div>
  );
};

export default CustomCursor;