import React, { useMemo, type JSX } from 'react';
import { motion } from 'framer-motion';

// Simple utility to merge class names
const cn = (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(' ');
}

interface TextShimmerProps {
  // Fix: The 'children' prop in React components should typically be of type
  // React.ReactNode to properly handle various child types supported by JSX.
  // Typing it as 'string' can cause issues with some toolchains.
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

export function TextShimmer({
  children,
  as: Component = 'p',
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const MotionComponent = motion(Component as keyof JSX.IntrinsicElements);

  // Fix: Calculate text length robustly from React.ReactNode children.
  // This converts children to an array and joins them into a single string.
  const textContent = useMemo(() => React.Children.toArray(children).join(''), [children]);

  const dynamicSpread = useMemo(() => {
    // Use the derived textContent's length for shimmer calculation.
    return textContent.length * spread;
  }, [textContent, spread]);

  // Colors from theme in index.html
  const baseColor = '#9ca3af'; // text-secondary
  const gradientColor = '#f8fafc'; // text-primary

  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent',
        '[background-repeat:no-repeat,padding-box]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          '--base-color': baseColor,
          '--base-gradient-color': gradientColor,
          backgroundImage: `linear-gradient(90deg, #0000 calc(50% - var(--spread)), var(--base-gradient-color), #0000 calc(50% + var(--spread))), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
}
