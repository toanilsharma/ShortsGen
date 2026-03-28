import React from 'react';

export interface Slide {
  id: string;
  type: string;
  content: string;
  duration?: number;
  animationId?: string;
  speed?: string;
  overlay?: string;
}

interface TimelineEditorProps {
  slides: Slide[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  setSlides?: (slides: Slide[]) => void;
}

function SlideItem({ slide, isActive, index, onClick, onDurationChange }: any) {
  return (
    <div
      className={`relative flex flex-col min-w-[140px] max-w-[140px] h-auto rounded-lg border-2 overflow-hidden bg-white shadow-sm transition-all cursor-pointer ${
        isActive ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-zinc-200 hover:border-indigo-300'
      }`}
      onClick={() => onClick(index)}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-50 px-2 py-1 border-b border-zinc-100">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider truncate">
          {slide.type}
        </span>
        <span className="text-[10px] text-zinc-400 font-mono">#{index + 1}</span>
      </div>

      {/* Content Preview */}
      <div className="flex-1 p-2 text-[11px] text-zinc-700 leading-tight overflow-hidden text-ellipsis line-clamp-3">
        {slide.content}
      </div>

      {/* Duration Control */}
      {onDurationChange && (
        <div className="px-2 py-1.5 border-t border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-semibold text-zinc-400 uppercase">Dur</span>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={(slide.duration || 3000) / 1000}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                onDurationChange(index, parseFloat(e.target.value) * 1000);
              }}
              className="flex-1 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="text-[9px] font-mono text-indigo-600 min-w-[20px] text-right">
              {((slide.duration || 3000) / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TimelineEditor({ slides, currentIndex, setCurrentIndex, setSlides }: TimelineEditorProps) {
  const handleDurationChange = (index: number, duration: number) => {
    if (!setSlides) return;
    const updated = slides.map((s, i) => i === index ? { ...s, duration } : s);
    setSlides(updated);
  };

  return (
    <div className="w-full bg-white border-t border-zinc-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10 shrink-0 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
            Timeline
          </h3>
          <span className="text-xs text-zinc-500">Drag slider to set per-slide duration</span>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x no-scrollbar">
          {slides.map((slide, index) => (
            <div key={slide.id} className="snap-start shrink-0">
              <SlideItem
                slide={slide}
                index={index}
                isActive={currentIndex === index}
                onClick={setCurrentIndex}
                onDurationChange={setSlides ? handleDurationChange : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
