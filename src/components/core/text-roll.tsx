'use client';

import React from 'react';
import {
  motion,
  VariantLabels,
  Target,
  TargetAndTransition,
  Transition,
} from 'motion/react';

export type TextRollProps = {
  children: string;
  duration?: number;
  getEnterDelay?: (index: number) => number;
  getExitDelay?: (index: number) => number;
  className?: string;
  transition?: Transition;
  variants?: {
    enter: {
      initial: Target | VariantLabels | boolean;
      animate: TargetAndTransition | VariantLabels;
    };
    exit: {
      initial: Target | VariantLabels | boolean;
      animate: TargetAndTransition | VariantLabels;
    };
  };
  onAnimationComplete?: () => void;
};

export function TextRoll({
  children,
  duration = 0.5,
  getEnterDelay = (i) => i * 0.05,
  getExitDelay = (i) => i * 0.05 + 0.2,
  className,
  transition = { ease: 'easeIn' },
  variants,
  onAnimationComplete,
}: TextRollProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>;
  }

  const defaultVariants = {
    enter: {
      initial: { rotateX: 0 },
      animate: { rotateX: 90 },
    },
    exit: {
      initial: { rotateX: 90 },
      animate: { rotateX: 0 },
    },
  } as const;

  const words = children.split(' ');
  const totalLetters = children.replace(/ /g, '').length;
  let currentLetterIdx = 0;

  return (
    <span className={className}>
      {words.map((word, wordIndex) => {
        const letters = word.split('');

        return (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {letters.map((letter) => {
              const i = currentLetterIdx++;
              const isLast = i === totalLetters - 1;

              return (
                <span
                  key={i}
                  className="relative inline-block [perspective:10000px] [transform-style:preserve-3d] [width:auto]"
                  style={{
                    perspective: '10000px',
                    transformStyle: 'preserve-3d',
                  }}
                  aria-hidden="true"
                >
                  <motion.span
                    className="absolute inline-block [backface-visibility:hidden] [transform-origin:50%_25%]"
                    style={{
                      backfaceVisibility: 'hidden',
                      transformOrigin: '50% 25%',
                    }}
                    initial={
                      variants?.enter?.initial ?? defaultVariants.enter.initial
                    }
                    animate={
                      variants?.enter?.animate ?? defaultVariants.enter.animate
                    }
                    transition={{
                      ...transition,
                      duration,
                      delay: getEnterDelay(i),
                    }}
                  >
                    {letter}
                  </motion.span>
                  <motion.span
                    className="absolute inline-block [backface-visibility:hidden] [transform-origin:50%_100%]"
                    style={{
                      backfaceVisibility: 'hidden',
                      transformOrigin: '50% 100%',
                    }}
                    initial={
                      variants?.exit?.initial ?? defaultVariants.exit.initial
                    }
                    animate={
                      variants?.exit?.animate ?? defaultVariants.exit.animate
                    }
                    transition={{
                      ...transition,
                      duration,
                      delay: getExitDelay(i),
                    }}
                    onAnimationComplete={
                      isLast ? onAnimationComplete : undefined
                    }
                  >
                    {letter}
                  </motion.span>
                  <span className="invisible">{letter}</span>
                </span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span className="inline-block" aria-hidden="true">
                &nbsp;
              </span>
            )}
          </span>
        );
      })}
      <span className="sr-only">{children}</span>
    </span>
  );
}
