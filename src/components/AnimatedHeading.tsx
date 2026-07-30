import React from 'react';
import { motion } from 'motion/react';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  highlightWord?: string | string[];
  highlightWords?: string[];
  highlightClass?: string;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  className = '',
  as = 'span',
  highlightWord,
  highlightWords,
  highlightClass = 'gold-text italic font-serif'
}) => {
  const words = text.split(' ');

  const rawHighlights: string[] = [];
  if (highlightWord) {
    if (Array.isArray(highlightWord)) {
      rawHighlights.push(...highlightWord);
    } else {
      rawHighlights.push(...highlightWord.split(' '));
    }
  }
  if (highlightWords) {
    rawHighlights.push(...highlightWords);
  }

  const normalizedTargets = rawHighlights
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase())
    .filter(Boolean);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
      y: 20,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 90,
        duration: 0.9,
      },
    },
  };

  const Component = 
    as === 'h1' ? motion.h1 :
    as === 'h2' ? motion.h2 :
    as === 'h3' ? motion.h3 :
    as === 'div' ? motion.div :
    motion.span;

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`inline-flex flex-wrap gap-x-[0.25em] gap-y-[0.1em] ${className}`}
    >
      {words.map((word, i) => {
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const isHighlighted = normalizedTargets.includes(cleanWord);

        return (
          <motion.span
            key={`${word}-${i}`}
            variants={wordVariants}
            className={`inline-block ${isHighlighted ? highlightClass : ''}`}
          >
            {word}
          </motion.span>
        );
      })}
    </Component>
  );
};
