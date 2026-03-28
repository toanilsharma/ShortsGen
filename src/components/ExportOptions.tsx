import React, { useState } from 'react';
import { Download, ChevronDown, Video, FileVideo, ImageIcon, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ExportOptionsProps {
  onExportVideo: (format: 'mp4' | 'webm') => void;
  onExportImage: () => void;
  isRecording: boolean;
  disabled?: boolean;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ onExportVideo, onExportImage, isRecording, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative ${isRecording ? 'text-red-500 hover:text-red-600 animate-pulse bg-red-50' : 'text-zinc-500 hover:text-indigo-600 transition-all hover:bg-zinc-100'}`}
          title="Export Options"
          disabled={disabled}
        >
          <Video className="w-5 h-5" />
          <ChevronDown className={`w-3 h-3 absolute -bottom-0.5 -right-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 bg-white rounded-xl shadow-2xl border border-zinc-200 animate-in slide-in-from-top-2 duration-200" align="end">
        <div className="space-y-1">
          <p className="px-2 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Video Formats</p>
          
          <button
            onClick={() => {
              onExportVideo('mp4');
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-between px-2 py-2 text-sm text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-2">
              <FileVideo className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
              <span>Download MP4</span>
            </div>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold">Recommended</span>
          </button>

          <button
            onClick={() => {
              onExportVideo('webm');
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors group"
          >
            <Video className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
            <span>Download WebM</span>
          </button>

          <div className="h-px bg-zinc-100 my-1 mx-2" />
          
          <p className="px-2 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Still Images</p>
          
          <button
            onClick={() => {
              onExportImage();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors group"
          >
            <ImageIcon className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
            <span>Save as PNG</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ExportOptions;
