import React from 'react';
import { Motion1CinematicBackground } from './Motion1CinematicBackground';

export interface AnimatedWhiteLinesBackgroundProps {
  className?: string;
}

/**
 * AnimatedWhiteLinesBackground is preserved for backward compatibility
 * and renders the Motion #1 abstract cinematic background with thin amber
 * architectural lines, flowing curves, and dark glass-like nodes.
 */
export const AnimatedWhiteLinesBackground: React.FC<AnimatedWhiteLinesBackgroundProps> = (props) => {
  return <Motion1CinematicBackground {...props} />;
};

export default AnimatedWhiteLinesBackground;
