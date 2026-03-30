export const COLORS = {
  indigo: { name: 'Indigo', hex: '#4f46e5', title: 'text-indigo-500', insight: 'bg-indigo-600 text-white', highlight: 'text-indigo-500 bg-indigo-500/10' },
  rose: { name: 'Rose', hex: '#e11d48', title: 'text-rose-500', insight: 'bg-rose-600 text-white', highlight: 'text-rose-500 bg-rose-500/10' },
  amber: { name: 'Yellow', hex: '#f59e0b', title: 'text-amber-500', insight: 'bg-amber-500 text-zinc-900', highlight: 'text-amber-500 bg-amber-500/10' },
  emerald: { name: 'Emerald', hex: '#10b981', title: 'text-emerald-500', insight: 'bg-emerald-600 text-white', highlight: 'text-emerald-500 bg-emerald-500/10' },
  cyan: { name: 'Cyan', hex: '#06b6d4', title: 'text-cyan-500', insight: 'bg-cyan-600 text-white', highlight: 'text-cyan-500 bg-cyan-500/10' },
  neon: { name: 'Neon Pink', hex: '#ec4899', title: 'text-pink-500', insight: 'bg-pink-600 text-white', highlight: 'text-pink-500 bg-pink-500/10' },
  violet: { name: 'Violet', hex: '#8b5cf6', title: 'text-violet-500', insight: 'bg-violet-600 text-white', highlight: 'text-violet-500 bg-violet-500/10' },
  fuchsia: { name: 'Fuchsia', hex: '#d946ef', title: 'text-fuchsia-500', insight: 'bg-fuchsia-600 text-white', highlight: 'text-fuchsia-500 bg-fuchsia-500/10' },
  lime: { name: 'Lime', hex: '#84cc16', title: 'text-lime-500', insight: 'bg-lime-600 text-black', highlight: 'text-lime-500 bg-lime-500/10' },
  orange: { name: 'Orange', hex: '#f97316', title: 'text-orange-500', insight: 'bg-orange-600 text-white', highlight: 'text-orange-500 bg-orange-500/10' },
};

export const BG_STYLES = {
  solid: 'Solid',
  gradient: 'Gradient',
  grid: 'Engineering Grid',
  dots: 'Polka Dots',
  waves: 'Diagonal Waves'
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
  },
  neon_nights: {
    id: 'neon_nights',
    name: 'Neon Nights',
    solidClass: 'bg-zinc-950',
    gradientClass: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-950',
    text: 'text-fuchsia-100',
    font: 'font-sans',
    pattern: 'radial-gradient(circle, rgba(217, 70, 239, 0.1) 1px, transparent 1px)',
    patternSize: '30px 30px'
  },
  retro: {
    id: 'retro',
    name: 'Retro Terminal',
    solidClass: 'bg-emerald-950',
    gradientClass: 'bg-gradient-to-b from-emerald-900 to-black',
    text: 'text-emerald-400',
    font: 'font-mono',
    pattern: 'linear-gradient(rgba(16, 185, 129, 0.05) 2px, transparent 2px)',
    patternSize: '100% 4px'
  },
  oceanic: {
    id: 'oceanic',
    name: 'Oceanic Depth',
    solidClass: 'bg-cyan-950',
    gradientClass: 'bg-gradient-to-br from-slate-900 via-cyan-950 to-blue-950',
    text: 'text-cyan-50',
    font: 'font-sans',
    pattern: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
    patternSize: '24px 24px'
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
  },
  blurReveal: {
    name: 'Blur Reveal',
    variants: {
      initial: { opacity: 0, filter: 'blur(10px)', scale: 1.1 },
      animate: { opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
      exit: { opacity: 0, filter: 'blur(10px)', scale: 1.1 }
    }
  },
  bouncyPop: {
    name: 'Bouncy Pop',
    variants: {
      initial: { opacity: 0, scale: 0.3 },
      animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 15 } },
      exit: { opacity: 0, scale: 0.5 }
    }
  },
  flip3d: {
    name: '3D Flip',
    variants: {
      initial: { opacity: 0, rotateX: 90 },
      animate: { opacity: 1, rotateX: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
      exit: { opacity: 0, rotateX: -90 }
    }
  },
  elasticSlide: {
    name: 'Elastic Slide',
    variants: {
      initial: { opacity: 0, x: -100 },
      animate: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 150, damping: 10, mass: 1.2 } },
      exit: { opacity: 0, x: 100 }
    }
  }
};

export const TEMPLATES = {
  reddit_story: {
    name: 'Reddit Story / Confession',
    text: `Title: I accidentally deleted our production database
It was 3 AM on a Friday and I was exhausted
I was trying to drop a test table
I forgot to specify the environment flag
Suddenly, 10 million user records vanished right before my eyes
Insight: Always double-check your terminal prompts`,
    themeId: 'dark',
    animationId: 'typewriter',
    bgStyle: 'solid',
    primaryColor: 'rose',
    textBackdrop: 'pill',
    musicTrack: 'lofi',
    globalOverlay: 'none'
  },
  motivational: {
    name: 'Sigma Hustle/Motivation',
    text: `Title: The 1% Rule For Success
Most people stop when they are tired
The greats stop when they are done
Discipline is choosing between what you want now
And what you want most in life
Insight: Outwork your excuses`,
    themeId: 'dark',
    animationId: 'elasticSlide',
    bgStyle: 'solid',
    primaryColor: 'amber',
    textBackdrop: 'none',
    musicTrack: 'cinematic',
    globalOverlay: 'none'
  },
  top_facts: {
    name: 'Top 3 Facts',
    text: `Title: 3 Psychology Facts You Didn't Know
Your brain uses 20% of your body's energy every day
Memories are reconstructed every single time you recall them
You can only maintain 150 stable relationships at once
Insight: The mind is your most powerful asset`,
    themeId: 'neon_nights',
    animationId: 'bouncyPop',
    bgStyle: 'dots',
    primaryColor: 'cyan',
    textBackdrop: 'frosted',
    musicTrack: 'techno',
    globalOverlay: 'none'
  },
  tech_hack: {
    name: 'Cyber Hacks & Tips',
    text: `Title: Stop Giving Away Your Data
Every website logs your digital footprint
Your ISP literally sells your browsing data to advertisers
Using a free VPN is actually worse than using none at all
Insight: Take back your digital privacy today`,
    themeId: 'cyberpunk',
    animationId: 'glitch',
    bgStyle: 'grid',
    primaryColor: 'emerald',
    textBackdrop: 'pill',
    musicTrack: 'techno',
    globalOverlay: 'matrix'
  },
  shower_thoughts: {
    name: 'Deep Shower Thoughts',
    text: `Title: Deep Shower Thoughts To Hack Your Brain
Water is just Earth's blood
We spend our whole lives gathering guests for our funeral
The oldest person on Earth has seen the entire human population replaced
Insight: Time is the only currency that matters`,
    themeId: 'oceanic',
    animationId: 'blurReveal',
    bgStyle: 'waves',
    primaryColor: 'indigo',
    textBackdrop: 'none',
    musicTrack: 'ambient',
    globalOverlay: 'waveform'
  },
  breaking_news: {
    name: 'Urgent Alert / News',
    text: `Title: URGENT SECURITY ALERT
A massive zero-day exploit was just found
Over 3 billion devices are currently vulnerable to attack
Update your smartphone software immediately
Insight: Security is not a luxury, it's a necessity`,
    themeId: 'retro',
    animationId: 'viralPop',
    bgStyle: 'solid',
    primaryColor: 'amber',
    textBackdrop: 'shadow',
    musicTrack: 'cinematic',
    globalOverlay: 'warning'
  }
};
