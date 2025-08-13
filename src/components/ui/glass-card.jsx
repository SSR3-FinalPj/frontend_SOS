import { motion } from 'framer-motion';

function GlassCard({ 
  children, 
  className = "",
  hover = true 
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export { GlassCard };