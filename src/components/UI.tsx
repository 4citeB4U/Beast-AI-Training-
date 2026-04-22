/*
LEEWAY HEADER — DO NOT REMOVE

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
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
    primary: 'bg-white text-black hover:bg-neutral-200',
    secondary: 'bg-emerald-500 text-black hover:bg-emerald-400',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    outline: 'border border-white/20 text-white hover:bg-white/5',
    brutal: 'bg-emerald-500 text-black font-black uppercase tracking-widest border border-white/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px] font-black uppercase tracking-widest',
    md: 'px-6 py-3 text-xs font-black uppercase tracking-[0.2em]',
    lg: 'px-8 py-4 text-sm font-black uppercase tracking-[0.3em]',
    xl: 'px-10 py-5 text-lg font-black uppercase tracking-[0.4em]'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
      className={`inline-flex items-center justify-center gap-2 rounded-none transition-all focus:outline-none ${variants[variant]} ${sizes[size]} ${className}`}
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
      className={`p-6 bg-black/40 backdrop-blur-sm ${brutal ? 'border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]' : 'border border-white/5'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const ProgressBar: React.FC<{ progress: number; className?: string }> = ({ progress, className = '' }) => {
  return (
    <div className={`h-2 w-full bg-neutral-200 overflow-hidden ${className}`}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className="h-full bg-emerald-500"
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
