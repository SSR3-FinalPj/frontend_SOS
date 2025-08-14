import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import AppleInput from '../ui/AppleInput.jsx';

export default function LoginCard({
  t,
  handle_login,
  isLoading,
  name,
  setName,
  password,
  setPassword,
  showPassword,
  onTogglePassword,
  go_back_to_landing,
  nameIcon, // New prop for name input icon
  passwordIcon // New prop for password input icon
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className="relative w-full max-w-md"   // 🔽 relative 추가
    >
      {/* Glassmorphism Card */}
      <motion.div 
        className="backdrop-blur-2xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-3xl shadow-2xl p-8 relative"
        whileHover={{ 
          scale: 1.01,
          transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
        }}
      >
        {/* Back Button */}
        <motion.button
          onClick={go_back_to_landing}
          whileHover={{ 
            scale: 1.1,
            x: -2,
            transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
          }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-6 left-6 p-2 backdrop-blur-sm bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-xl hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </motion.button>

        {/* Header */}
        <div className="text-center mb-8 pt-8">
          {/* Brand Logo */}
          <motion.div 
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.2, 
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
              }}
            >
              <span className="text-white font-semibold text-lg">AI</span>
            </motion.div>
            <span className="text-2xl font-light text-gray-800 dark:text-white">{t.brandName}</span>
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.4, 
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <h1 className="text-3xl font-light text-gray-800 dark:text-white mb-2">
              {t.welcomeBack}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-light">
              {t.loginSubtitle}
            </p>
          </motion.div>
        </div>

        {/* Login Form */}
        <motion.form
          onSubmit={handle_login}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.6, 
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="space-y-6"
        >
          {/* Name Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: 0.7, 
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.username}
            </label>
            <AppleInput
              type="text"
              placeholder={t.usernamePlaceholder}
              value={name}
              onChange={setName}
              Icon={nameIcon}
            />
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: 0.8, 
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.password}
            </label>
            <AppleInput
              type={showPassword ? "text" : "password"}
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={setPassword}
              showPasswordToggle={true}
              onTogglePassword={onTogglePassword}
              Icon={passwordIcon}
            />
          </motion.div>

          {/* Forgot Password Link */}
          <motion.div 
            className="text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              delay: 0.9, 
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <motion.button
              type="button"
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
              }}
              whileTap={{ scale: 0.97 }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            >
              {t.forgotPassword}
            </motion.button>
          </motion.div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ 
              scale: 1.02, 
              y: -2,
              transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
            }}
            whileTap={{ 
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 1, 
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
              />
            ) : (
              t.loginButton
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}
