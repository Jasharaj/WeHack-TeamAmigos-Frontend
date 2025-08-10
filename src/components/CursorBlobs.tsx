'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MousePosition {
  x: number;
  y: number;
}

const CursorBlobs = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary blob - follows cursor closely */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 15,
          mass: 0.5,
        }}
      />

      {/* Secondary blob - follows with delay */}
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-5"
        style={{
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, rgba(16, 185, 129, 0.03) 60%, transparent 80%)',
          filter: 'blur(100px)',
        }}
        animate={{
          x: mousePosition.x - 160,
          y: mousePosition.y - 160,
        }}
        transition={{
          type: "spring",
          stiffness: 30,
          damping: 20,
          mass: 0.8,
        }}
      />

      {/* Tertiary blob - follows with more delay */}
      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-3"
        style={{
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.06) 0%, rgba(13, 148, 136, 0.02) 50%, transparent 70%)',
          filter: 'blur(120px)',
        }}
        animate={{
          x: mousePosition.x - 128,
          y: mousePosition.y - 128,
        }}
        transition={{
          type: "spring",
          stiffness: 20,
          damping: 25,
          mass: 1.2,
        }}
      />

      {/* Small accent blob */}
      <motion.div
        className="absolute w-32 h-32 rounded-full opacity-2"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, rgba(21, 128, 61, 0.02) 40%, transparent 60%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: mousePosition.x - 64,
          y: mousePosition.y - 64,
        }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 12,
          mass: 0.3,
        }}
      />

      {/* Static floating blobs for ambient effect */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-2"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full opacity-2"
        style={{
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.04) 0%, transparent 70%)',
          filter: 'blur(140px)',
        }}
        animate={{
          scale: [1, 0.8, 1],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute top-2/3 left-1/2 w-48 h-48 rounded-full opacity-1"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.03) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default CursorBlobs;
