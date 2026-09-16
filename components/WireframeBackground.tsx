import React, { useEffect, useRef } from 'react';

const WireframeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const gridSize = 50;
    const repulsionRadius = 150;
    const repulsionStrength = 25;

    const draw = () => {
      // Lerp mouse
      mouseX += (targetMouseX - mouseX) * 0.15;
      mouseY += (targetMouseY - mouseY) * 0.15;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const computedStyle = getComputedStyle(document.body);
      const fgColor = computedStyle.getPropertyValue('--fg').trim() || '#000000';
      
      // Draw grid with brutalist wireframe styling
      ctx.strokeStyle = `${fgColor}1A`; // Very subtle opacity (about 10%)
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        for (let y = 0; y <= canvas.height + gridSize; y += gridSize) {
          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let offsetX = 0;
          let offsetY = 0;
          
          if (dist < repulsionRadius) {
            const force = Math.pow((repulsionRadius - dist) / repulsionRadius, 2);
            offsetX = (dx / dist) * force * repulsionStrength;
            offsetY = (dy / dist) * force * repulsionStrength;
          }

          if (y === 0) {
            ctx.moveTo(x + offsetX, y + offsetY);
          } else {
            ctx.lineTo(x + offsetX, y + offsetY);
          }
        }
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width + gridSize; x += gridSize) {
          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let offsetX = 0;
          let offsetY = 0;
          
          if (dist < repulsionRadius) {
            const force = Math.pow((repulsionRadius - dist) / repulsionRadius, 2);
            offsetX = (dx / dist) * force * repulsionStrength;
            offsetY = (dy / dist) * force * repulsionStrength;
          }

          if (x === 0) {
            ctx.moveTo(x + offsetX, y + offsetY);
          } else {
            ctx.lineTo(x + offsetX, y + offsetY);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default WireframeBackground;
