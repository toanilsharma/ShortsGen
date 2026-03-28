import React from 'react';
import { Video, Monitor, MousePointer2, AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';

interface RecordingGuideProps {
  onConfirm: () => void;
  onCancel: () => void;
  format: 'mp4' | 'webm';
}

const RecordingGuide: React.FC<RecordingGuideProps> = ({ onConfirm, onCancel, format }) => {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-indigo-600 p-6 text-white relative">
          <button 
            onClick={onCancel}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Video className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Export High Quality Video</h2>
          </div>
          <p className="text-indigo-100 text-sm">Follow these 3 simple steps to download your short.</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-none w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-100">1</div>
              <div>
                <p className="font-semibold text-zinc-900">Click "Start Capture"</p>
                <p className="text-xs text-zinc-500 mt-0.5">A browser permission popup will appear.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-none w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-100">2</div>
              <div>
                <p className="font-semibold text-zinc-900">Select "This Tab"</p>
                <div className="flex items-center gap-1.5 mt-1 bg-zinc-50 p-2 rounded border border-zinc-100 italic text-[10px] text-zinc-600">
                  <Monitor className="w-3 h-3 text-indigo-500" />
                  Select "ShortsGen" window from the list
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-none w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-100">3</div>
              <div>
                <p className="font-semibold text-zinc-900">Share & Wait</p>
                <p className="text-xs text-zinc-500 mt-0.5">The video will record automatically and download as <span className="font-mono font-bold text-indigo-600">.{format}</span></p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-3 text-amber-800">
            <AlertCircle className="w-5 h-5 flex-none mt-0.5 text-amber-500" />
            <div className="text-[11px] leading-relaxed">
              <p className="font-bold">Important Information:</p>
              <p>Keep this tab open and visible during recording. The process stops automatically once the video finishes playing.</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-10 shadow-lg shadow-indigo-200" onClick={onConfirm}>
              Start Capture
              <MousePointer2 className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingGuide;
