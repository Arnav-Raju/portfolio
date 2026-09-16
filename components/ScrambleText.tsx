import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface ScrambleTextProps {
  text: string;
  className?: string;
}

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  
  useEffect(() => {
    if (!isInView) {
      setDisplayText(text.replace(/[a-zA-Z0-9]/g, '_'));
      return;
    }

    let iteration = 0;
    let animationFrameId: number;
    const maxIterations = text.length * 4; // Frames per letter

    const animate = () => {
      setDisplayText(text.split('').map((char, index) => {
        if (char === ' ') return ' ';
        if (index < Math.floor(iteration / 4)) {
          return char;
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(''));

      if (iteration < maxIterations) {
        iteration += 1;
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, text]);

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  );
};

export default ScrambleText;
