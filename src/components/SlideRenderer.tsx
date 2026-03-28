import React from 'react';
import { motion } from 'framer-motion';
import AnimationWrapper from './AnimationWrapper';
import { COLORS } from '../lib/ThemeConfig';

interface Slide {
  id: string;
  type: string;
  content: string;
  duration?: number;
  animationId?: string;
  speed?: string;
}

interface SlideRendererProps {
  slide: Slide;
  theme: any;
  animation: any;
  speed: string;
  primaryColor: keyof typeof COLORS;
  fontScale: number;
  contentWidth: number;
}

const highlightText = (text: string, colorConfig: any, isInsight: boolean = false) => {
  const keywords = ['Failure', 'Warning', 'Danger', 'Error', 'Action', 'Predictive', 'Downtime', 'Catastrophic'];
  let parts: (string | React.ReactNode)[] = [text];

  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return part;
      const split = part.split(regex);
      return split.map((s, i) =>
        s.toLowerCase() === keyword.toLowerCase() ? (
          <span key={`${keyword}-${i}`} className={`font-bold px-1 rounded ${isInsight ? 'bg-white/20' : colorConfig.highlight}`}>{s}</span>
        ) : s
      );
    });
  });

  return parts;
};

const viralWordStyle = (word: string, i: number, animation: any) => (
  <motion.span
    key={i}
    variants={animation.childVariants}
    className="inline-block px-2 py-0.5 m-1 rounded-sm bg-yellow-400 text-black font-black uppercase tracking-tighter shadow-[4px_4px_0px_rgba(0,0,0,1)]"
  >
    {word}
  </motion.span>
);

const renderAnimatedText = (text: string, animation: any, colorConfig: any, isInsight: boolean = false) => {
  if (animation.name === 'Staggered Text' || animation.name === 'Viral Pop') {
    const words = text.split(' ');
    const isViral = animation.name === 'Viral Pop';
    
    return (
      <motion.div variants={animation.variants} initial="initial" animate="animate" exit="exit" className="flex flex-wrap justify-center items-center gap-y-2">
        {words.map((word, i) => (
          isViral ? viralWordStyle(word, i, animation) : (
            <motion.span key={i} variants={animation.childVariants}>
              {highlightText(word, colorConfig, isInsight)}
            </motion.span>
          )
        ))}
      </motion.div>
    );
  } else if (animation.name === 'Typewriter Effect') {
    const chars = text.split('');
    return (
      <motion.div variants={animation.variants} initial="initial" animate="animate" exit="exit" className="inline-block">
        {chars.map((char, i) => (
          <motion.span key={i} variants={animation.childVariants}>
            {char}
          </motion.span>
        ))}
      </motion.div>
    );
  }
  return highlightText(text, colorConfig, isInsight);
};

export const SlideRenderer: React.FC<SlideRendererProps> = ({ slide, theme, animation, speed, primaryColor, fontScale, contentWidth }) => {
  if (!slide) return null;

  const isTitle = slide.type === 'title';
  const isInsight = slide.type === 'insight';
  const colorConfig = COLORS[primaryColor];

  const scale = fontScale / 100;
  const titleSize = `${18 * scale}px`;
  const bodySize = `${12 * scale}px`;
  const insightSize = `${14 * scale}px`;

  return (
    <AnimationWrapper animation={animation} speed={speed} id={slide.id}>
      <div 
        className={`w-full mx-auto flex flex-col items-center justify-start py-12 gap-6 ${theme.font} max-h-full overflow-y-auto custom-scrollbar overflow-x-hidden transition-all duration-300`}
        style={{ maxWidth: `${contentWidth}%` }}
      >
        {isTitle && (
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`font-extrabold leading-tight tracking-tighter ${colorConfig.title} w-full text-center break-words uppercase`}
            style={{ fontSize: titleSize }}
          >
            {renderAnimatedText(slide.content, animation, colorConfig)}
          </motion.h1>
        )}

        {!isTitle && !isInsight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`leading-relaxed font-semibold ${theme.text} w-full text-center break-words`}
            style={{ fontSize: bodySize }}
          >
            {renderAnimatedText(slide.content, animation, colorConfig)}
          </motion.div>
        )}

        {isInsight && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className={`p-3 rounded-lg shadow-2xl ${colorConfig.insight} w-full text-center break-words`}
          >
            <p className="text-[9px] uppercase tracking-widest font-black mb-2 opacity-80 text-black">Technical Insight</p>
            <div 
              className="font-extrabold leading-tight tracking-tighter"
              style={{ fontSize: insightSize }}
            >
              {renderAnimatedText(slide.content, animation, colorConfig, true)}
            </div>
          </motion.div>
        )}
      </div>
    </AnimationWrapper>
  );
};

export default SlideRenderer;
