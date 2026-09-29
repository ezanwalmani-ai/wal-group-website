import React from 'react';

export interface ProgressiveBlurProps {
  direction?: 'left' | 'right' | 'top' | 'bottom';
  blurLayers?: number;
  blurIntensity?: number;
  className?: string;
  fallbackColor?: string;
}

/**
 * ProgressiveBlur creates a high-performance multi-layered gradient backdrop blur.
 * Used for creating smooth, feathered blur and fade edges on carousel and slider components.
 */
export function ProgressiveBlur({
  direction = 'left',
  blurLayers = 8,
  blurIntensity = 0.5,
  className = '',
  fallbackColor,
}: ProgressiveBlurProps) {
  const layers = Array.from({ length: blurLayers }, (_, i) => i + 1);

  return (
    <div 
      className={`pointer-events-none absolute z-20 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Optional progressive color fade layer for rich contrast */}
      {fallbackColor && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: direction === 'left' 
              ? `linear-gradient(to right, ${fallbackColor} 0%, transparent 100%)`
              : direction === 'right'
              ? `linear-gradient(to left, ${fallbackColor} 0%, transparent 100%)`
              : direction === 'top'
              ? `linear-gradient(to bottom, ${fallbackColor} 0%, transparent 100%)`
              : `linear-gradient(to top, ${fallbackColor} 0%, transparent 100%)`
          }}
        />
      )}

      {/* Layered Progressive Backdrop Blur */}
      {layers.map((layer) => {
        const percentage = (layer / blurLayers) * 100;
        const blurRadius = (layer * 1.75 * blurIntensity).toFixed(1);

        let mask = '';
        if (direction === 'left') {
          mask = `linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) ${percentage}%)`;
        } else if (direction === 'right') {
          mask = `linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) ${percentage}%)`;
        } else if (direction === 'top') {
          mask = `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) ${percentage}%)`;
        } else {
          mask = `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) ${percentage}%)`;
        }

        return (
          <div
            key={layer}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blurRadius}px)`,
              WebkitBackdropFilter: `blur(${blurRadius}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}

export default ProgressiveBlur;
