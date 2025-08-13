import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { usePageStore } from '../stores/page_store.js';

// Translation content for login page
const loginTranslations = {
  ko: {
    brandName: "콘텐츠부스트",
    welcomeBack: "다시 오신 것을 환영합니다",
    subtitle: "계정에 로그인하여 AI 콘텐츠 관리를 시작하세요",
    email: "이메일",
    emailPlaceholder: "your@email.com",
    password: "비밀번호",
    passwordPlaceholder: "비밀번호를 입력하세요",
    forgotPassword: "비밀번호를 잊으셨나요?",
    loginButton: "로그인",
    backToHome: "홈으로 돌아가기"
  },
  en: {
    brandName: "ContentBoost",
    welcomeBack: "Welcome Back",
    subtitle: "Sign in to your account to start AI content management",
    email: "Email",
    emailPlaceholder: "your@email.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    forgotPassword: "Forgot your password?",
    loginButton: "Sign In",
    backToHome: "Back to Home"
  }
};

// Clean Apple-style input component with light/dark mode support
function AppleInput({
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  showPasswordToggle = false,
  onTogglePassword
}) {
  return (
    <motion.div 
      className="relative"
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
      }}
      whileFocus={{ 
        scale: 1.01,
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
      }}
    >
      <motion.div 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </motion.div>
      <motion.input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
      />
      {showPasswordToggle && (
        <motion.button
          type="button"
          onClick={onTogglePassword}
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
          }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
        >
          {type === 'password' ? (
            <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200" />
          ) : (
            <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200" />
          )}
        </motion.button>
      )}
    </motion.div>
  );
}

export default function LoginPage() {
  const { setCurrentPage, isDarkMode, language } = usePageStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const t = loginTranslations[language] || loginTranslations['ko'];

  // Login simulation
  const handle_login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to dashboard
    setCurrentPage('dashboard');
    setIsLoading(false);
  };

  const go_back_to_landing = () => {
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
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
          className="w-full max-w-md"
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
                  {t.subtitle}
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
              {/* Email Input */}
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
                  {t.email}
                </label>
                <AppleInput
                  type="email"
                  placeholder={t.emailPlaceholder}
                  icon={Mail}
                  value={email}
                  onChange={setEmail}
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
                  icon={Lock}
                  value={password}
                  onChange={setPassword}
                  showPasswordToggle={true}
                  onTogglePassword={() => setShowPassword(!showPassword)}
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

          {/* Bottom Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              delay: 1.2, 
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="text-center mt-6"
          >
            <motion.button
              onClick={go_back_to_landing}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
              }}
              whileTap={{ scale: 0.97 }}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm duration-200"
            >
              {t.backToHome}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}