import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface EngineeringOverlaysProps {
  type: string;
}

export default function EngineeringOverlays({ type }: EngineeringOverlaysProps) {
  if (!type || type === 'none') return null;

  if (type === 'waveform') {
    return (
      <div className="absolute bottom-0 left-0 w-full h-32 flex items-end justify-between px-2 opacity-30 pointer-events-none z-0">
        {[...Array(60)].map((_, i) => {
          const height = 10 + Math.random() * 90;
          const delay = Math.random() * -2;
          const duration = 0.5 + Math.random() * 0.8;
          return (
            <div
              key={i}
              className="w-1 bg-current rounded-t-sm"
              style={{
                height: `${height}%`,
                animation: `waveform ${duration}s ease-in-out infinite ${delay}s`,
                transformOrigin: 'bottom'
              }}
            />
          );
        })}
      </div>
    );
  }

  if (type === 'heatmap') {
    return (
      <div 
        className="absolute inset-0 opacity-50 pointer-events-none mix-blend-overlay z-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(239, 68, 68, 0.9) 0%, transparent 60%),
            radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.9) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.6) 0%, transparent 60%),
            radial-gradient(circle at 80% 20%, rgba(234, 179, 8, 0.7) 0%, transparent 50%)
          `,
          filter: 'blur(30px)'
        }}
      />
    );
  }

  if (type === 'warning') {
    return (
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {/* Flashing border */}
        <div className="absolute inset-0 border-[8px] border-red-500/80 animate-pulse" />
        
        {/* Hazard stripes top */}
        <div 
          className="absolute top-0 left-0 w-full h-4 opacity-90" 
          style={{ background: 'repeating-linear-gradient(45deg, #ef4444, #ef4444 16px, transparent 16px, transparent 32px)' }} 
        />
        
        {/* Hazard stripes bottom */}
        <div 
          className="absolute bottom-0 left-0 w-full h-4 opacity-90" 
          style={{ background: 'repeating-linear-gradient(45deg, #ef4444, #ef4444 16px, transparent 16px, transparent 32px)' }} 
        />
        
        {/* Warning text */}
        <div className="absolute top-8 right-8 text-red-500 flex items-center gap-2 font-mono font-bold bg-red-500/10 px-4 py-2 rounded backdrop-blur-md border border-red-500/30 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          <AlertTriangle className="w-6 h-6" />
          <span className="tracking-widest">CRITICAL WARNING</span>
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.15)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
      </div>
    );
  }

  if (type === 'crt') {
    return (
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden mix-blend-overlay">
        {/* Scanlines */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            backgroundSize: '100% 4px, 3px 100%'
          }}
        />
        {/* Vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 50%, rgba(0, 0, 0, 0.6) 100%)'
          }}
        />
        {/* Screen flicker */}
        <div className="absolute inset-0 bg-white opacity-[0.02] animate-pulse" />
      </div>
    );
  }

  if (type === 'matrix') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-20 mix-blend-screen">
        {[...Array(20)].map((_, i) => {
          const delay = Math.random() * -5;
          const duration = 2 + Math.random() * 3;
          const left = `${(i / 20) * 100}%`;
          return (
            <div
              key={i}
              className="absolute top-0 w-4 text-green-500 font-mono text-xs leading-none break-all"
              style={{
                left,
                animation: `matrix-fall ${duration}s linear infinite ${delay}s`,
                textShadow: '0 0 5px #22c55e'
              }}
            >
              {Array.from({length: 30}, () => String.fromCharCode(0x30A0 + Math.random() * 96)).join('\n')}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}
