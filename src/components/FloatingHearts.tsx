'use client';

import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
  speed: number;
  opacity: number;
  rotation: number;
}

const HEART_EMOJIS = ['💖', '💕', '💗', '💓', '✨', '🌸', '💘'];

export default function FloatingHearts() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [clickHearts, setClickHearts] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  useEffect(() => {
    // Generate gentle background floating hearts
    const initialParticles: Particle[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 14 + 14,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
      speed: Math.random() * 10 + 12,
      opacity: Math.random() * 0.4 + 0.2,
      rotation: Math.random() * 40 - 20,
    }));
    setParticles(initialParticles);
  }, []);

  // Click on screen to spawn cute heart
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't trigger if clicked on button or interactive elements
      const target = e.target as HTMLElement;
      if (target.closest('button, input, a, select, textarea')) return;

      const newHeart = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
      };

      setClickHearts((prev) => [...prev.slice(-8), newHeart]);

      setTimeout(() => {
        setClickHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 1200);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Floating Hearts */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute select-none transition-transform"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animation: `floatSlow ${p.speed}s ease-in-out infinite`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Interactive Click Hearts */}
      {clickHearts.map((h) => (
        <div
          key={h.id}
          className="fixed text-2xl select-none animate-bounce"
          style={{
            left: `${h.x - 12}px`,
            top: `${h.y - 20}px`,
            animation: 'heartClickUp 1.2s forwards ease-out',
          }}
        >
          {h.emoji}
        </div>
      ))}

      <style jsx global>{`
        @keyframes heartClickUp {
          0% {
            opacity: 1;
            transform: scale(0.6) translateY(0);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.4) translateY(-30px);
          }
          100% {
            opacity: 0;
            transform: scale(1) translateY(-70px);
          }
        }
      `}</style>
    </div>
  );
}
