import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

// Clean Apple-style input component with light/dark mode support
export default function AppleInput({
  type = "text",
  placeholder,
  value,
  onChange,
  showPasswordToggle = false,
  onTogglePassword,
  Icon // New prop for the icon component
}) {
  const handleChange = (e) => {
    if (typeof onChange !== 'function') return;
    onChange(e?.target ? e.target.value : e);
  };

  const isPasswordHidden = type === 'password';

  return (
    <motion.div 
      className="relative"
      whileHover={{ scale: 1.01, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
      whileFocus={{ scale: 1.01, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
    >
      {/* 좌측 장식(아이콘 대체용) 필요 없으면 제거 가능 */}
      {Icon && (
        <motion.div 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </motion.div>
      )}

      <motion.input
        type={type}
        placeholder={placeholder}
        value={value ?? ''}              
        onChange={handleChange}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
      />

      {showPasswordToggle && (
        <motion.button
          type="button"
          onClick={onTogglePassword}
          whileHover={{ scale: 1.1, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
          aria-label="Toggle password visibility"
        >
          {isPasswordHidden ? (
            <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200" />
          ) : (
            <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200" />
          )}
        </motion.button>
      )}
    </motion.div>
  );
}
