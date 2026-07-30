import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface AnimatedIconProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  icon?: LucideIcon;
  children?: React.ReactNode;
  animation?: 'pulse' | 'rotate' | 'bounce' | 'scale' | 'spin' | 'float' | 'shake';
  size?: number | string;
  className?: string;
  iconClassName?: string;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon: Icon,
  children,
  animation = 'rotate',
  size = 24,
  className = '',
  iconClassName = '',
  ...props
}) => {
  let hoverAnimation = {};

  switch (animation) {
    case 'rotate':
      hoverAnimation = { rotate: 12, scale: 1.1 };
      break;
    case 'pulse':
      hoverAnimation = { scale: [1, 1.2, 1.1] };
      break;
    case 'bounce':
      hoverAnimation = { y: -4, scale: 1.08 };
      break;
    case 'scale':
      hoverAnimation = { scale: 1.15 };
      break;
    case 'spin':
      hoverAnimation = { rotate: 180, scale: 1.1 };
      break;
    case 'float':
      hoverAnimation = { scale: 1.12, y: -4 };
      break;
    case 'shake':
      hoverAnimation = { rotate: [-8, 8, -6, 6, 0], scale: 1.1 };
      break;
    default:
      hoverAnimation = { scale: 1.1, rotate: 6 };
  }

  const isKeyframeAnimation = animation === 'float' || animation === 'shake' || animation === 'pulse';

  return (
    <motion.div
      whileHover={hoverAnimation}
      animate={animation === 'float' ? { y: [0, -4, 0] } : undefined}
      transition={
        animation === 'float'
          ? {
              y: {
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              scale: {
                type: 'spring',
                stiffness: 400,
                damping: 17,
              },
            }
          : isKeyframeAnimation
          ? {
              duration: 0.4,
              ease: 'easeInOut',
            }
          : {
              type: 'spring',
              stiffness: 400,
              damping: 17,
            }
      }
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {Icon ? <Icon size={size} className={iconClassName} /> : children}
    </motion.div>
  );
};
