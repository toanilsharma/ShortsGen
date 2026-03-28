import React from 'react';
import { motion } from 'framer-motion';

interface AnimationWrapperProps {
  children: React.ReactNode;
  animation: any;
  speed: string;
  id: number;
}

export default function AnimationWrapper({ children, animation, speed, id }: AnimationWrapperProps) {
  const duration = speed === 'slow' ? 0.8 : speed === 'fast' ? 0.3 : 0.5;

  return (
    <motion.div
      key={id}
      variants={animation.variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration, ease: "easeInOut" }}
      className="absolute inset-0 flex flex-col items-center justify-center px-8 pt-8 pb-8 text-center w-full h-full"
    >
      {children}
    </motion.div>
  );
}
