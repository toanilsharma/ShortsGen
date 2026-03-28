import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Clock } from 'lucide-react';
import { ANIMATIONS } from '../lib/ThemeConfig';

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
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

function SortableSlideItem({ slide, isActive, index, onUpdateSlide, onClick }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex flex-col min-w-[140px] max-w-[140px] h-[170px] rounded-lg border-2 overflow-hidden bg-white shadow-sm transition-colors cursor-pointer ${
        isActive ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-zinc-200 hover:border-indigo-300'
      }`}
      onClick={() => onClick(index)}
    >
      {/* Drag Handle & Header */}
      <div className="flex items-center justify-between bg-zinc-50 px-2 py-1 border-b border-zinc-100">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-zinc-200 rounded text-zinc-400 hover:text-zinc-600 outline-none"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3 h-3" />
        </div>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider truncate ml-1">
          {slide.type}
        </span>
      </div>

      {/* Content Preview */}
      <div className="flex-1 p-2 text-xs text-zinc-700 leading-tight overflow-y-auto">
        {slide.content}
      </div>

      {/* Per-slide Animation Controls */}
      <div className="flex flex-col gap-1 px-2 py-1 bg-zinc-50 border-t border-zinc-100 text-[9px]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Anim:</span>
          <select
            value={slide.animationId || ''}
            onChange={(e) => onUpdateSlide(slide.id, { animationId: e.target.value || undefined })}
            className="bg-transparent text-zinc-600 outline-none w-[70px] text-right truncate"
          >
            <option value="">Global</option>
            {Object.entries(ANIMATIONS).map(([id, a]) => (
              <option key={id} value={id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Speed:</span>
          <select
            value={slide.speed || ''}
            onChange={(e) => onUpdateSlide(slide.id, { speed: e.target.value || undefined })}
            className="bg-transparent text-zinc-600 outline-none w-[70px] text-right"
          >
            <option value="">Global</option>
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Overlay:</span>
          <select
            value={slide.overlay || ''}
            onChange={(e) => onUpdateSlide(slide.id, { overlay: e.target.value || undefined })}
            className="bg-transparent text-zinc-600 outline-none w-[70px] text-right truncate"
          >
            <option value="">Global</option>
            <option value="none">None</option>
            <option value="waveform">Waveform</option>
            <option value="heatmap">Heatmap</option>
            <option value="warning">Warning</option>
            <option value="crt">CRT</option>
            <option value="matrix">Matrix</option>
          </select>
        </div>
      </div>

      {/* Duration Control */}
      <div 
        className="flex items-center gap-1 px-2 py-1 bg-zinc-50 border-t border-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
        <input
          type="number"
          min="0.5"
          step="0.5"
          value={slide.duration ? slide.duration / 1000 : ''}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onUpdateSlide(slide.id, { duration: isNaN(val) ? undefined : val * 1000 });
          }}
          placeholder="Auto"
          className="w-full bg-transparent text-[10px] font-medium text-zinc-600 focus:outline-none"
        />
        <span className="text-[10px] text-zinc-400">s</span>
      </div>
    </div>
  );
}

export default function TimelineEditor({ slides, setSlides, currentIndex, setCurrentIndex }: TimelineEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSlides((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Adjust current index if the active slide is moved
        if (currentIndex === oldIndex) {
          setCurrentIndex(newIndex);
        } else if (currentIndex > oldIndex && currentIndex <= newIndex) {
          setCurrentIndex(currentIndex - 1);
        } else if (currentIndex < oldIndex && currentIndex >= newIndex) {
          setCurrentIndex(currentIndex + 1);
        }

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleUpdateSlide = (id: string, updates: Partial<Slide>) => {
    setSlides((items) =>
      items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  return (
    <div className="w-full bg-white border-t border-zinc-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10 shrink-0">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
            Timeline Editor
          </h3>
          <span className="text-xs text-zinc-500">Drag to reorder • Set custom durations</span>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x">
            <SortableContext
              items={slides.map(s => s.id)}
              strategy={horizontalListSortingStrategy}
            >
              {slides.map((slide, index) => (
                <div key={slide.id} className="snap-start shrink-0">
                  <SortableSlideItem
                    slide={slide}
                    index={index}
                    isActive={currentIndex === index}
                    onUpdateSlide={handleUpdateSlide}
                    onClick={setCurrentIndex}
                  />
                </div>
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
