import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Download, Maximize, LayoutTemplate, Settings2, Type, Palette, Video, AtSign } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

import { THEMES, ANIMATIONS, TEMPLATES, COLORS, BG_STYLES } from './lib/ThemeConfig';
import SlideRenderer from './components/SlideRenderer';
import TimelineEditor from './components/TimelineEditor';
import EngineeringOverlays from './components/EngineeringOverlays';
import BackgroundMusic, { MUSIC_TRACKS } from './components/BackgroundMusic';

import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Card, CardContent } from './components/ui/card';

interface Slide {
  id: string;
  type: string;
  content: string;
  duration?: number;
  animationId?: string;
  speed?: string;
  overlay?: string;
}

function parseTextToSlides(text: string): Slide[] {
  const rawLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const processedLines: string[] = [];

  rawLines.forEach(line => {
    if (line.length > 120 && !line.toLowerCase().startsWith('title:') && !line.toLowerCase().startsWith('insight:')) {
      const sentences = line.match(/[^.!?]+[.!?]+/g) || [line];
      sentences.forEach(s => processedLines.push(s.trim()));
    } else {
      processedLines.push(line);
    }
  });

  return processedLines.map((line, index) => {
    let type = 'normal';
    let content = line;
    if (index === 0 || line.toLowerCase().startsWith('title:')) {
      type = 'title';
      content = line.replace(/^title:\s*/i, '');
    } else if (index === processedLines.length - 1 && line.toLowerCase().startsWith('insight:')) {
      type = 'insight';
      content = line.replace(/^insight:\s*/i, '');
    }
    return { id: `slide-${Date.now()}-${index}`, type, content };
  });
}

export default function App() {
  const [inputText, setInputText] = useState(TEMPLATES.predictive.text);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [themeId, setThemeId] = useState<keyof typeof THEMES>('industrial');
  const [animationId, setAnimationId] = useState<keyof typeof ANIMATIONS>('slideUp');
  const [speed, setSpeed] = useState('medium');
  const [primaryColor, setPrimaryColor] = useState<keyof typeof COLORS>('amber');
  const [bgStyle, setBgStyle] = useState<keyof typeof BG_STYLES>('grid');
  const [fontScale, setFontScale] = useState(100);
  const [contentWidth, setContentWidth] = useState(95);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [globalOverlay, setGlobalOverlay] = useState<string>('none');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'preview' | 'edit'>('preview');
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [creditText, setCreditText] = useState('@slidegen');
  const [musicTrack, setMusicTrack] = useState<keyof typeof MUSIC_TRACKS>('none');
  const [countdown, setCountdown] = useState<number | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setSlides(parseTextToSlides(inputText));
    setCurrentIndex(0);
  }, [inputText]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && slides.length > 0) {
      const currentSlide = slides[currentIndex];
      const baseSpeed = speed === 'slow' ? 4000 : speed === 'fast' ? 2000 : 3000;
      const slideDuration = currentSlide?.duration || baseSpeed;

      timeout = setTimeout(() => {
        setCurrentIndex((prev) => {
          if (prev < slides.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, slideDuration);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, currentIndex, slides, speed]);

  const handleExportImages = async () => {
    if (!previewRef.current) return;
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `slide-${currentIndex + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Error exporting image:", error);
    }
  };

  const startRecording = useCallback(async () => {
    if (!previewRef.current || slides.length === 0) return;
    
    // Start countdown
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise(r => setTimeout(r, 1000));
    }
    setCountdown(null);

    setIsRecording(true);
    setRecordingProgress(0);
    setCurrentIndex(0);
    chunksRef.current = [];

    try {
      // 1. Capture the DOM element as a canvas stream
      // Note: This is a simplified approach. For perfect high-res video export 
      // of DOM elements, a more complex setup with a headless browser or 
      // frame-by-frame rendering to a hidden canvas is usually required.
      // Here we use a basic approach that captures the visible screen area.
      
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "browser",
        },
        audio: false,
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = 'slidegen-export.webm';
        a.click();
        window.URL.revokeObjectURL(url);
        setIsRecording(false);
        setRecordingProgress(0);
        
        // Stop all tracks to end screen sharing
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100); // Collect 100ms chunks
      
      // Start playback automatically
      setIsPlaying(true);

    } catch (err) {
      console.error("Error starting recording:", err);
      setIsRecording(false);
    }
  }, [slides.length]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsPlaying(false);
  }, []);

  // Auto-stop recording when presentation finishes
  useEffect(() => {
    if (isRecording && !isPlaying && currentIndex === slides.length - 1) {
      // Add a small delay to capture the final transition
      setTimeout(() => {
        stopRecording();
      }, 1000);
    }
  }, [isRecording, isPlaying, currentIndex, slides.length, stopRecording]);

  // Update recording progress
  useEffect(() => {
    if (isRecording) {
      setRecordingProgress((currentIndex / Math.max(1, slides.length - 1)) * 100);
    }
  }, [currentIndex, isRecording, slides.length]);


  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Swipe handling
  let touchStartX = 0;
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) setCurrentIndex(Math.min(slides.length - 1, currentIndex + 1));
    if (touchEndX - touchStartX > 50) setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const theme = THEMES[themeId];
  const currentSlide = slides[currentIndex];
  const activeAnimationId = currentSlide?.animationId || animationId;
  const activeSpeed = currentSlide?.speed || speed;
  const activeOverlay = currentSlide?.overlay || globalOverlay;
  const animation = ANIMATIONS[activeAnimationId as keyof typeof ANIMATIONS] || ANIMATIONS[animationId];
  
  const bgClass = bgStyle === 'gradient' ? theme.gradientClass : theme.solidClass;
  const bgPattern = bgStyle === 'grid' ? theme.pattern : 'none';

  const getCanvasStyle = () => {
    const isVertical = aspectRatio === '9:16';
    const targetRatio = isVertical ? 9 / 16 : 16 / 9;
    
    if (containerDimensions.width === 0 || containerDimensions.height === 0) {
      return { 
        aspectRatio: isVertical ? '9/16' : '16/9',
        width: '100%',
        backgroundImage: bgPattern,
        backgroundSize: theme.patternSize
      };
    }

    const containerRatio = containerDimensions.width / containerDimensions.height;
    let width, height;

    if (containerRatio > targetRatio) {
      height = containerDimensions.height;
      width = height * targetRatio;
    } else {
      width = containerDimensions.width;
      height = width / targetRatio;
    }

    return {
      width: `${width}px`,
      height: `${height}px`,
      backgroundImage: bgPattern,
      backgroundSize: theme.patternSize
    };
  };

  return (
    <div className="h-[100dvh] w-full bg-zinc-100 flex flex-col md:flex-row font-sans text-zinc-900 overflow-hidden">
      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex-none flex bg-white border-b border-zinc-200 z-50">
        <button 
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${mobileTab === 'preview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-zinc-500 hover:text-zinc-700'}`}
          onClick={() => setMobileTab('preview')}
        >
          Preview
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${mobileTab === 'edit' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-zinc-500 hover:text-zinc-700'}`}
          onClick={() => setMobileTab('edit')}
        >
          Edit & Timeline
        </button>
      </div>

      {/* Left Panel - Controls */}
      <div className={`w-full md:w-[400px] bg-white border-r border-zinc-200 flex-col h-full overflow-y-auto shrink-0 ${mobileTab === 'preview' ? 'hidden md:flex' : 'flex'} ${isFullscreen ? 'hidden' : ''}`}>
        <div className="p-4 md:p-6 border-b border-zinc-200 shrink-0">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-indigo-600" />
            SlideGen
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Text to Vertical Video</p>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-8">
          {/* Templates */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-zinc-500">
              <LayoutTemplate className="w-4 h-4" /> Templates
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(TEMPLATES).map(([id, t]) => (
                <Button
                  key={id}
                  variant="outline"
                  className="justify-start font-normal"
                  onClick={() => setInputText(t.text)}
                >
                  {t.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="space-y-3 flex-1 flex flex-col">
            <Label className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-zinc-500">
              <Type className="w-4 h-4" /> Content
            </Label>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full flex-1 min-h-[200px] font-mono text-sm resize-none"
              placeholder="Enter your text here..."
            />
            
            <div className="pt-2 shrink-0">
              <Label className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <AtSign className="w-3 h-3" /> Watermark / Credit
              </Label>
              <input
                type="text"
                value={creditText}
                onChange={(e) => setCreditText(e.target.value)}
                placeholder="e.g. @yourhandle or website.com"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-zinc-500">
              <Settings2 className="w-4 h-4" /> Settings
            </Label>

            <div className="space-y-3">
              <div>
                <Label className="text-xs text-zinc-500 mb-1 block">Theme</Label>
                <Select value={themeId} onValueChange={(val) => setThemeId(val as keyof typeof THEMES)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(THEMES).map(([id, t]) => (
                      <SelectItem key={id} value={id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-zinc-500 mb-1 block">Animation</Label>
                <Select value={animationId} onValueChange={(val) => setAnimationId(val as keyof typeof ANIMATIONS)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select animation" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ANIMATIONS).map(([id, a]) => (
                      <SelectItem key={id} value={id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-zinc-500 mb-1 block">Background Music</Label>
                <Select value={musicTrack} onValueChange={(val) => setMusicTrack(val as keyof typeof MUSIC_TRACKS)}>
                  <SelectTrigger>
                    <SelectValue placeholder="No Music" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MUSIC_TRACKS).map(([id, t]) => (
                      <SelectItem key={id} value={id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-zinc-500">
              <Palette className="w-4 h-4" /> Appearance
            </Label>

            <div className="space-y-3">
              <div>
                <Label className="text-xs text-zinc-500 mb-1 block">Visual Overlay</Label>
                <Select value={globalOverlay} onValueChange={setGlobalOverlay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select overlay" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="waveform">Waveform</SelectItem>
                    <SelectItem value="heatmap">Heatmap</SelectItem>
                    <SelectItem value="warning">Warning Indicators</SelectItem>
                    <SelectItem value="crt">CRT Monitor</SelectItem>
                    <SelectItem value="matrix">Matrix Rain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-zinc-500 mb-2 block">Primary Color</Label>
                <div className="flex gap-2">
                  {Object.entries(COLORS).map(([id, c]) => (
                    <button
                      key={id}
                      onClick={() => setPrimaryColor(id as keyof typeof COLORS)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${primaryColor === id ? 'border-zinc-900 scale-110' : 'border-transparent hover:scale-110'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-zinc-500 mb-1 block">Background Style</Label>
                <Select value={bgStyle} onValueChange={(val) => setBgStyle(val as keyof typeof BG_STYLES)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select background" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(BG_STYLES).map(([id, name]) => (
                      <SelectItem key={id} value={id}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-zinc-500 mb-1 block">Aspect Ratio</Label>
                <div className="flex rounded-md border border-zinc-200 overflow-hidden">
                  {['9:16', '16:9'].map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio as '9:16' | '16:9')}
                      className={`flex-1 py-1.5 text-xs ${aspectRatio === ratio ? 'bg-indigo-100 text-indigo-700 font-medium' : 'bg-white hover:bg-zinc-50'}`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs text-zinc-500 block">Font Scale</Label>
                  <span className="text-[10px] font-mono text-indigo-600">{fontScale}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="5"
                  value={fontScale}
                  onChange={(e) => setFontScale(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs text-zinc-500 block">Content Width</Label>
                  <span className="text-[10px] font-mono text-indigo-600">{contentWidth}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="100"
                  step="1"
                  value={contentWidth}
                  onChange={(e) => setContentWidth(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Editor on Mobile */}
        <div className="md:hidden border-t border-zinc-200 mt-auto shrink-0">
          <TimelineEditor
            slides={slides}
            setSlides={setSlides}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        </div>
      </div>

      {/* Right Panel - Preview & Timeline */}
      <div className={`w-full md:flex-1 flex-col h-full overflow-hidden bg-zinc-100 shrink-0 ${mobileTab === 'edit' ? 'hidden md:flex' : 'flex'}`}>
        <div 
          className={`flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-0 transition-all ${isFullscreen ? 'p-0 bg-black' : 'p-4 md:p-8'}`} 
          ref={containerRef}
        >
          {/* Preview Canvas */}
        <div
          className={`relative overflow-hidden flex flex-col ${bgClass} transition-all duration-500 animate-bg-pan shrink-0 ${isFullscreen ? 'rounded-none shadow-none' : 'rounded-xl md:rounded-2xl shadow-2xl'}`}
          style={getCanvasStyle()}
          ref={previewRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/20 z-50 flex gap-1 p-2">
            {slides.map((_, i) => (
              <div key={i} className="flex-1 h-full bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: i < currentIndex ? '100%' : i === currentIndex ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>

          {/* Slide Content */}
          <div className="flex-1 relative overflow-hidden">
            <EngineeringOverlays type={activeOverlay} />
            <AnimatePresence mode="wait">
              {slides.length > 0 && (
                <SlideRenderer
                  key={`${currentIndex}-${activeAnimationId}-${activeSpeed}`}
                  slide={slides[currentIndex]}
                  theme={theme}
                  animation={animation}
                  speed={activeSpeed}
                  primaryColor={primaryColor}
                  fontScale={fontScale}
                  contentWidth={contentWidth}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Watermark / Credit */}
          {creditText && (
            <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center z-[100] pointer-events-none">
              <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-[10px] sm:text-xs font-medium tracking-wide shadow-lg">
                {creditText}
              </div>
            </div>
          )}
        </div>

        <BackgroundMusic trackId={musicTrack} isPlaying={isPlaying || countdown !== null} />

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
            <div className="text-8xl font-black text-white animate-bounce drop-shadow-2xl">
              {countdown}
            </div>
          </div>
        )}

        {/* Playback Controls */}
        <div className={`flex-none flex items-center justify-center gap-2 md:gap-4 bg-white px-4 py-3 md:px-6 md:py-3 border-t border-zinc-200 ${isFullscreen ? 'absolute bottom-8 opacity-0 hover:opacity-100 transition-opacity left-1/2 -translate-x-1/2 rounded-full shadow-lg' : ''}`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="text-zinc-500 hover:text-zinc-900"
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentIndex(Math.min(slides.length - 1, currentIndex + 1))}
            disabled={currentIndex === slides.length - 1}
            className="text-zinc-500 hover:text-zinc-900"
          >
            <SkipForward className="w-5 h-5" />
          </Button>

          <div className="w-px h-6 bg-zinc-200 mx-2" />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleExportImages}
            className="text-zinc-500 hover:text-indigo-600"
            title="Export Current Slide (PNG)"
            disabled={isRecording}
          >
            <Download className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            className={`${isRecording ? 'text-red-500 hover:text-red-600 animate-pulse' : 'text-zinc-500 hover:text-indigo-600'}`}
            title={isRecording ? "Stop Recording" : "Export Video (WebM)"}
          >
            <Video className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-zinc-500 hover:text-indigo-600"
            title="Screen Recording Mode"
            disabled={isRecording}
          >
            <Maximize className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Recording Progress Bar */}
        {isRecording && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 flex flex-col gap-2 z-50">
            <div className="flex justify-between items-center text-xs font-semibold text-zinc-700">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Recording Video...
              </span>
              <span>{Math.round(recordingProgress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${recordingProgress}%` }}
              />
            </div>
          </div>
        )}
        </div>

        {/* Timeline Editor on Desktop */}
        <div className="hidden md:block flex-none border-t border-zinc-200 bg-white">
          <TimelineEditor
            slides={slides}
            setSlides={setSlides}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        </div>
      </div>
    </div>
  );
}
