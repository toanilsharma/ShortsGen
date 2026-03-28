export const COLORS = {
  indigo: { name: 'Indigo', hex: '#4f46e5', title: 'text-indigo-500', insight: 'bg-indigo-600 text-white', highlight: 'text-indigo-500 bg-indigo-500/10' },
  rose: { name: 'Rose', hex: '#e11d48', title: 'text-rose-500', insight: 'bg-rose-600 text-white', highlight: 'text-rose-500 bg-rose-500/10' },
  amber: { name: 'Yellow', hex: '#f59e0b', title: 'text-amber-500', insight: 'bg-amber-500 text-zinc-900', highlight: 'text-amber-500 bg-amber-500/10' },
  emerald: { name: 'Emerald', hex: '#10b981', title: 'text-emerald-500', insight: 'bg-emerald-600 text-white', highlight: 'text-emerald-500 bg-emerald-500/10' },
  cyan: { name: 'Cyan', hex: '#06b6d4', title: 'text-cyan-500', insight: 'bg-cyan-600 text-white', highlight: 'text-cyan-500 bg-cyan-500/10' },
  neon: { name: 'Neon Pink', hex: '#ec4899', title: 'text-pink-500', insight: 'bg-pink-600 text-white', highlight: 'text-pink-500 bg-pink-500/10' },
};

export const BG_STYLES = {
  solid: 'Solid',
  gradient: 'Gradient',
  grid: 'Engineering Grid'
};

export const THEMES = {
  industrial: {
    id: 'industrial',
    name: 'Industrial',
    solidClass: 'bg-zinc-950',
    gradientClass: 'bg-gradient-to-br from-zinc-800 to-zinc-950',
    text: 'text-zinc-300',
    font: 'font-mono',
    pattern: 'radial-gradient(circle, #3f3f46 1px, transparent 1px)',
    patternSize: '24px 24px'
  },
  tech: {
    id: 'tech',
    name: 'Tech',
    solidClass: 'bg-slate-950',
    gradientClass: 'bg-gradient-to-br from-slate-900 to-slate-950',
    text: 'text-slate-200',
    font: 'font-sans',
    pattern: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
    patternSize: '40px 40px'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    solidClass: 'bg-gray-50',
    gradientClass: 'bg-gradient-to-br from-white to-gray-200',
    text: 'text-gray-600',
    font: 'font-serif',
    pattern: 'none',
    patternSize: 'auto'
  },
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    solidClass: 'bg-black',
    gradientClass: 'bg-gradient-to-br from-gray-900 to-black',
    text: 'text-gray-300',
    font: 'font-sans',
    pattern: 'none',
    patternSize: 'auto'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    solidClass: 'bg-zinc-950',
    gradientClass: 'bg-gradient-to-br from-purple-950 via-zinc-900 to-cyan-950',
    text: 'text-cyan-400',
    font: 'font-mono',
    pattern: 'linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px), linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px)',
    patternSize: '20px 20px'
  }
};

export const ANIMATIONS = {
  fadeScale: {
    name: 'Fade + Scale',
    variants: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.1 }
    }
  },
  slideUp: {
    name: 'Slide Up',
    variants: {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -40 }
    }
  },
  zoom: {
    name: 'Zoom Emphasis',
    variants: {
      initial: { opacity: 0, scale: 1.2 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 }
    }
  },
  staggered: {
    name: 'Staggered Text',
    variants: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
      exit: { opacity: 0 }
    },
    childVariants: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    }
  },
  typewriter: {
    name: 'Typewriter Effect',
    variants: {
      initial: { opacity: 1 },
      animate: { opacity: 1, transition: { staggerChildren: 0.05 } },
      exit: { opacity: 0 }
    },
    childVariants: {
      initial: { opacity: 0, display: 'none' },
      animate: { opacity: 1, display: 'inline' }
    }
  },
  glitch: {
    name: 'Glitch Reveal',
    variants: {
      initial: { opacity: 0, x: -20, skewX: 20 },
      animate: { 
        opacity: 1, 
        x: 0, 
        skewX: 0,
        transition: { type: 'spring', stiffness: 200, damping: 10 }
      },
      exit: { opacity: 0, x: 20, skewX: -20 }
    }
  },
  viralPop: {
    name: 'Viral Pop',
    variants: {
      initial: { opacity: 1 },
      animate: { opacity: 1, transition: { staggerChildren: 0.12 } },
      exit: { opacity: 0 }
    },
    childVariants: {
      initial: { opacity: 0, scale: 0.5, y: 10 },
      animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 12 } }
    }
  }
};

export const TEMPLATES = {
  predictive: {
    name: 'Predictive Maintenance',
    text: `Title: Vibration Analysis Saved This Machine
Machine running normal
Vibration increasing slowly
Warning ignored
Failure avoided due to early detection
Insight: Prediction works only with action`
  },
  failure: {
    name: 'Failure Story',
    text: `Title: The $10,000 Bearing Failure
Pump P-102 operating at 100% load
Lubrication schedule missed by 2 weeks
Temperature spiked to 180°C
Catastrophic bearing seizure
Insight: Maintenance schedules are not suggestions`
  },
  insight: {
    name: 'Quick Insight',
    text: `Title: The Cost of Downtime
Reactive maintenance costs 5x more
Planned downtime is an investment
Unplanned downtime is an expense
Insight: Fix it before it breaks`
  }
};
