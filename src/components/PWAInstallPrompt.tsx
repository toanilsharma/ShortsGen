import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from './ui/button';

export default function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Wait a few seconds before showing to not distract the user immediately
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
      setInstallPrompt(null);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 md:w-80 bg-white/95 backdrop-blur border border-zinc-200 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 z-[9999] animate-in slide-in-from-top-4 md:slide-in-from-bottom-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-zinc-900">Install ShortsGen App</h4>
            <p className="text-xs text-zinc-500 mt-0.5 leading-snug">Get a faster, fullscreen, native-like experience.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-zinc-400 hover:text-zinc-600 shrink-0 p-1 -mr-2 -mt-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex justify-end gap-2 w-full mt-1">
        <Button variant="ghost" className="text-xs h-8 text-zinc-500" onClick={() => setIsVisible(false)}>Maybe Later</Button>
        <Button className="text-xs h-8 px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20" onClick={handleInstallClick}>Install</Button>
      </div>
    </div>
  );
}
