/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.COMPONENT
TAG: UI.BEAST.COMPONENT.UI

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=component

5WH:
WHAT = BEAST AI Component: UI.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/components/UI.tsx
WHEN = 2026-04-21
HOW = Autonomous Agent Engineering

AGENTS:
VECTOR
ARIA
WARD
GOVERNOR

LICENSE:
MIT
*/

import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'brutal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20',
    secondary: 'bg-white text-slate-900 border-2 border-slate-200 hover:bg-slate-50 shadow-sm',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    outline: 'border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
    brutal: 'bg-emerald-500 text-slate-900 font-bold border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-xs font-bold uppercase tracking-widest',
    md: 'px-8 py-4 text-sm font-bold uppercase tracking-tight',
    lg: 'px-10 py-5 text-base font-bold uppercase tracking-tight',
    xl: 'px-12 py-6 text-xl font-bold uppercase tracking-normal'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.03, y: -6 }}
      className={`inline-flex items-center justify-center gap-4 rounded-full transition-all focus:outline-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={IconSizeMap[size]} />}
      {children}
    </motion.button>
  );
};

const IconSizeMap = {
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20
};

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { brutal?: boolean }> = ({ children, className = '', brutal, ...props }) => {
  return (
    <div 
      className={`p-12 md:p-16 bg-white/95 backdrop-blur-3xl rounded-[4rem] border-2 border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const ProgressBar: React.FC<{ progress: number; className?: string }> = ({ progress, className = '' }) => {
  return (
    <div className={`h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 ${className}`}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
      />
    </div>
  );
};

export const ProgressRing: React.FC<{ progress: number; size?: number; strokeWidth?: number; color?: string }> = ({ 
  progress, 
  size = 60, 
  strokeWidth = 6,
  color = '#10b981' 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute font-bold text-xs">
        {Math.round(progress)}%
      </div>
    </div>
  );
};
