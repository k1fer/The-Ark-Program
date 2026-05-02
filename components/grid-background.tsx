"use client";

import { useEffect, useRef } from "react";

export function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridSize = 50;
      const primaryColor = "rgba(255, 45, 74, 0.08)";
      const glowColor = "rgba(255, 45, 74, 0.2)";

      // Draw grid lines
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 0.5;

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw pulsing glow at intersections
      const intersectionCount = 8;
      for (let i = 0; i < intersectionCount; i++) {
        const x = Math.floor((Math.sin(time + i * 0.5) * 0.5 + 0.5) * (canvas.width / gridSize)) * gridSize;
        const y = Math.floor((Math.cos(time * 0.7 + i * 0.3) * 0.5 + 0.5) * (canvas.height / gridSize)) * gridSize;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, gridSize * 2);
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, "transparent");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, gridSize * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw data flow lines occasionally
      const flowCount = 3;
      for (let i = 0; i < flowCount; i++) {
        const progress = (time * 0.2 + i * 0.33) % 1;
        const startX = 0;
        const startY = (canvas.height * (i + 1)) / (flowCount + 1);
        const length = canvas.width * progress;
        
        const gradient = ctx.createLinearGradient(startX, startY, startX + length, startY);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.8, "rgba(255, 45, 74, 0.1)");
        gradient.addColorStop(1, "rgba(255, 45, 74, 0.3)");
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + length, startY);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
