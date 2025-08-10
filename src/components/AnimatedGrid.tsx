'use client';
import { motion } from 'framer-motion';

const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}
      />
      
      {/* Animated Grid Dots at Intersections */}
      <div 
        className="absolute inset-0 opacity-[0.19]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(16, 185, 129, 0.8) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />
      
      {/* Moving Grid Lines Animation */}
      <motion.div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.6) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '30px 30px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Pulsing Grid Overlay */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 197, 94, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 197, 94, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
        animate={{
          opacity: [0.08, 0.14, 0.08],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Subtle Dot Pattern Animation */}
      <motion.div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(16, 185, 129, 0.6) 0.5px, transparent 0.5px)`,
          backgroundSize: '15px 15px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '15px 0px', '0px 15px', '15px 15px', '0px 0px'],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};


export default AnimatedGrid;
