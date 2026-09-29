import React, { 
  Children, 
  cloneElement, 
  isValidElement, 
  useEffect, 
  useState, 
  useId, 
  useRef,
  ReactElement,
  ReactNode 
} from 'react';
import { AnimatePresence, motion, Transition } from 'motion/react';

export interface AnimatedBackgroundProps {
  children: ReactNode;
  defaultValue?: string | null;
  value?: string | null;
  onValueChange?: (newActiveId: string | null) => void;
  className?: string;
  transition?: Transition;
  enableHover?: boolean;
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function AnimatedBackground({
  children,
  defaultValue,
  value,
  onValueChange,
  className,
  transition,
  enableHover = false,
}: AnimatedBackgroundProps) {
  const [activeId, setActiveId] = useState<string | null>(value ?? defaultValue ?? null);
  const uniqueId = useId();
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value !== undefined) {
      setActiveId(value);
    } else if (defaultValue !== undefined) {
      setActiveId(defaultValue);
    }
  }, [value, defaultValue]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleSetActiveId = (id: string | null) => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    setActiveId(id);
    if (onValueChange) {
      onValueChange(id);
    }
  };

  const handleHoverLeave = () => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    // Small buffer delay so moving between adjacent buttons is completely seamless
    resetTimerRef.current = setTimeout(() => {
      const fallback = value !== undefined ? value : (defaultValue ?? null);
      setActiveId(fallback);
      if (onValueChange) {
        onValueChange(fallback);
      }
    }, 80);
  };

  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const defaultTransition: Transition = prefersReducedMotion 
    ? { duration: 0 } 
    : (transition ?? {
        type: 'spring',
        bounce: 0.2,
        duration: 0.3,
      });

  return (
    <>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) {
          return child;
        }

        const childElement = child as ReactElement<any>;
        const id = childElement.props['data-id'] !== undefined 
          ? String(childElement.props['data-id']) 
          : String(index);

        const isSelected = activeId === id;

        const interactionProps = enableHover
          ? {
              onMouseEnter: (e: React.MouseEvent) => {
                childElement.props.onMouseEnter?.(e);
                handleSetActiveId(id);
              },
              onMouseLeave: (e: React.MouseEvent) => {
                childElement.props.onMouseLeave?.(e);
                handleHoverLeave();
              },
              onFocus: (e: React.FocusEvent) => {
                childElement.props.onFocus?.(e);
                handleSetActiveId(id);
              },
              onBlur: (e: React.FocusEvent) => {
                childElement.props.onBlur?.(e);
                handleHoverLeave();
              },
            }
          : {
              onClick: (e: React.MouseEvent) => {
                childElement.props.onClick?.(e);
                handleSetActiveId(id);
              },
              onFocus: (e: React.FocusEvent) => {
                childElement.props.onFocus?.(e);
                handleSetActiveId(id);
              },
            };

        return cloneElement(
          childElement,
          {
            key: childElement.key ?? index,
            className: cn('relative inline-flex items-center justify-center', childElement.props.className),
            'aria-selected': isSelected,
            'data-checked': isSelected ? 'true' : 'false',
            ...interactionProps,
            children: (
              <>
                <AnimatePresence initial={false}>
                  {isSelected && (
                    <motion.div
                      layoutId={`animated-bg-${uniqueId}`}
                      className={cn('absolute inset-0 pointer-events-none', className)}
                      transition={defaultTransition}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
                {childElement.props.children}
              </>
            ),
          }
        );
      })}
    </>
  );
}
