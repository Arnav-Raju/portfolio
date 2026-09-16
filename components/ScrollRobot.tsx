import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const ScrollRobot: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const top = useTransform(scaleX, (v) => `${v * 85}%`);

  return (
    <div className="fixed top-[15%] right-[2px] md:right-2 h-[70vh] w-4 z-40 hidden md:flex flex-col items-center pointer-events-none">
      {/* Line */}
      <div className="absolute top-0 bottom-0 w-px bg-fg/20"></div>
      
      {/* Pixel Icon */}
      <motion.div
        style={{ top }}
        className="absolute w-4 h-4 bg-fg flex items-center justify-center"
      >
        <div className="w-1 h-1 bg-bg rounded-full"></div>
      </motion.div>
    </div>
  );
};

export default ScrollRobot;