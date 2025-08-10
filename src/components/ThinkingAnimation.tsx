'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface ThinkingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  showText?: boolean;
}

export default function ThinkingAnimation({ 
  size = 'md', 
  color = '#10b981',
  className = '',
  showText = true
}: ThinkingAnimationProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const dotVariants = {
    initial: { y: 0, opacity: 0.4 },
    animate: {
      y: [-6, 0, -6],
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 1.2,
        ease: "easeInOut" as const,
        repeat: Infinity,
      }
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showText && (
        <motion.span 
          className="text-slate-700 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Thinking
        </motion.span>
      )}
      <div className="flex items-center space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`${sizeClasses[size]} rounded-full`}
            style={{ backgroundColor: color }}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Modern pulsing loader
export const PulseLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.div
        className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
    </div>
  );
};

// Modern spinner
export const ModernSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="60 40"
          className="text-green-600"
        />
      </svg>
    </motion.div>
  );
};
