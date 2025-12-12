import React from 'react';
import { motion } from 'framer-motion';

type AnimationType = 'fade' | 'slide' | 'scale' | 'flip' | 'rotate';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: AnimationType;
}

// Fade animation (default)
const fadeVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

// Slide animation (from bottom)
const slideVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

// Scale animation
const scaleVariants = {
  initial: { opacity: 0, scale: 0.9 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.1 },
};

// Flip animation
const flipVariants = {
  initial: { opacity: 0, rotateX: 90 },
  in: { opacity: 1, rotateX: 0 },
  out: { opacity: 0, rotateX: -90 },
};

// Rotate animation
const rotateVariants = {
  initial: { opacity: 0, rotate: -5, scale: 0.95 },
  in: { opacity: 1, rotate: 0, scale: 1 },
  out: { opacity: 0, rotate: 5, scale: 0.95 },
};

const transitions = {
  fade: { duration: 0.3, ease: 'easeInOut' },
  slide: { type: 'tween', ease: 'anticipate', duration: 0.4 },
  scale: { type: 'spring', stiffness: 300, damping: 30 },
  flip: { type: 'spring', stiffness: 300, damping: 35 },
  rotate: { type: 'spring', stiffness: 200, damping: 20 },
};

const getVariants = (type: AnimationType) => {
  switch (type) {
    case 'fade': return fadeVariants;
    case 'slide': return slideVariants;
    case 'scale': return scaleVariants;
    case 'flip': return flipVariants;
    case 'rotate': return rotateVariants;
    default: return fadeVariants;
  }
};

const getTransition = (type: AnimationType) => {
  return transitions[type];
};

const PageTransition: React.FC<PageTransitionProps> = ({ children, type = 'slide' }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={getVariants(type)}
      transition={getTransition(type)}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
