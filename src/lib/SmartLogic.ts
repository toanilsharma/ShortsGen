import { THEMES, ANIMATIONS, COLORS } from './ThemeConfig';

export interface SmartSettings {
  themeId: keyof typeof THEMES;
  animationId: keyof typeof ANIMATIONS;
  primaryColor: keyof typeof COLORS;
  bgStyle: 'solid' | 'gradient' | 'grid';
  fontScale: number;
  musicTrackId: string;
  overlayId: string;
}

const KEYWORD_MAP: Record<string, Partial<SmartSettings>> = {
  // Industrial
  'machine': { themeId: 'industrial', primaryColor: 'amber', animationId: 'slideUp', bgStyle: 'grid', musicTrackId: 'techno', overlayId: 'waveform' },
  'pump': { themeId: 'industrial', primaryColor: 'amber', musicTrackId: 'techno' },
  'vibration': { themeId: 'industrial', primaryColor: 'rose', animationId: 'glitch', overlayId: 'heatmap' },
  'failure': { themeId: 'industrial', primaryColor: 'rose', animationId: 'viralPop', musicTrackId: 'cinematic', overlayId: 'warning' },
  'warning': { themeId: 'industrial', primaryColor: 'amber', animationId: 'glitch', overlayId: 'warning' },
  'factory': { themeId: 'industrial', bgStyle: 'grid', musicTrackId: 'techno' },
  
  // Tech / AI
  'ai': { themeId: 'tech', primaryColor: 'cyan', animationId: 'glitch', bgStyle: 'grid', musicTrackId: 'techno', overlayId: 'matrix' },
  'algorithm': { themeId: 'tech', animationId: 'glitch', overlayId: 'matrix' },
  'data': { themeId: 'tech', primaryColor: 'indigo', musicTrackId: 'lofi', overlayId: 'heatmap' },
  'future': { themeId: 'tech', primaryColor: 'neon', musicTrackId: 'techno', overlayId: 'crt' },
  'smart': { themeId: 'tech', primaryColor: 'cyan', musicTrackId: 'lofi' },
  'neural': { themeId: 'tech', animationId: 'staggered', musicTrackId: 'techno' },
  
  // Cyberpunk
  'neon': { themeId: 'cyberpunk', primaryColor: 'neon', animationId: 'glitch', bgStyle: 'gradient', musicTrackId: 'techno', overlayId: 'crt' },
  'hack': { themeId: 'cyberpunk', primaryColor: 'emerald', animationId: 'typewriter', musicTrackId: 'techno', overlayId: 'matrix' },
  'security': { themeId: 'cyberpunk', primaryColor: 'rose', animationId: 'glitch', musicTrackId: 'cinematic', overlayId: 'matrix' },
  'breach': { themeId: 'cyberpunk', primaryColor: 'rose', animationId: 'viralPop', overlayId: 'warning' },
  
  // Minimal / Motivational
  'success': { themeId: 'minimal', primaryColor: 'emerald', animationId: 'zoom', bgStyle: 'solid', musicTrackId: 'lofi', overlayId: 'none' },
  'minimal': { themeId: 'minimal', bgStyle: 'solid', musicTrackId: 'lofi' },
  'focus': { themeId: 'minimal', animationId: 'fadeScale', musicTrackId: 'lofi' },
  'investment': { themeId: 'minimal', primaryColor: 'indigo', musicTrackId: 'lofi' },
  
  // Danger / Dark
  'danger': { themeId: 'dark', primaryColor: 'rose', animationId: 'viralPop', bgStyle: 'gradient', musicTrackId: 'cinematic', overlayId: 'warning' },
  'stop': { themeId: 'dark', primaryColor: 'rose', musicTrackId: 'cinematic' },
  'critical': { themeId: 'dark', animationId: 'glitch', overlayId: 'warning' },
};

export function getSmartConfiguration(text: string): SmartSettings {
  const lowercaseText = text.toLowerCase();
  
  // Default fallback settings
  let settings: SmartSettings = {
    themeId: 'dark',
    animationId: 'slideUp',
    primaryColor: 'indigo',
    bgStyle: 'gradient',
    fontScale: 100,
    musicTrackId: 'none',
    overlayId: 'none'
  };

  // Score mapping
  const scores: Record<string, number> = {
    industrial: 0,
    tech: 0,
    cyberpunk: 0,
    minimal: 0,
    dark: 0,
  };

  // Basic keyword matching
  Object.keys(KEYWORD_MAP).forEach(keyword => {
    if (lowercaseText.includes(keyword)) {
      const effect = KEYWORD_MAP[keyword];
      if (effect.themeId) scores[effect.themeId] += 2;
      
      // Update transient settings based on frequency
      if (effect.primaryColor) settings.primaryColor = effect.primaryColor;
      if (effect.animationId) settings.animationId = effect.animationId;
      if (effect.bgStyle) settings.bgStyle = effect.bgStyle;
      if (effect.musicTrackId) settings.musicTrackId = effect.musicTrackId;
      if (effect.overlayId) settings.overlayId = effect.overlayId;
    }
  });

  // Pick the best theme
  const bestThemeId = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  if (scores[bestThemeId] > 0) {
    settings.themeId = bestThemeId as SmartSettings['themeId'];
  }

  // Final Auto-scaling for the first slide (Title)
  settings.fontScale = calculateOptimalFontScale(text.split('\n')[0]);

  return settings;
}

export function calculateOptimalFontScale(text: string): number {
  if (!text) return 100;
  
  const charCount = text.length;
  // If text is short, scale up for impact
  if (charCount < 20) return 140; 
  if (charCount < 40) return 110;
  // if text is very long, scale down slightly to avoid overflow
  if (charCount > 80) return 85;
  if (charCount > 120) return 70;
  
  return 100;
}

export function calculateSlideDuration(content: string, isHeader: boolean): number {
  const words = content.trim().split(/\s+/).length;
  // Base duration is 450ms per word, minimum 2.5s, maximum 6s
  let duration = Math.min(6000, Math.max(2500, words * 450));
  
  if (isHeader) duration *= 1.25; // Headers stay slightly longer
  
  return duration;
}
