import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePageStore } from '../stores/page_store.js';
import LoginCard from '../components/login/LoginCard.jsx';
import { User, Lock } from 'lucide-react';

// 🔹 토큰 유틸 + API 호출 가져오기
import { loginApi } from '../lib/auth_bootstrap.js';
import { setAutoLoginEnabled } from '../lib/token.js';
//import { BASE_API_URL } from '../lib/config.js'; // 없으면 그냥 BASE_API_URL = 'http://localhost:8080';

const loginTranslations = {
  ko: {
    brandName: "콘텐츠부스트",
    welcomeBack: "다시 오신 것을 환영합니다",
    subtitle: "계정에 로그인하여 AI 콘텐츠 관리를 시작하세요",
    // 🔽 추가
    name: "아이디",
    placeholder: "아이디를 입력하세요",
    password: "비밀번호",
    passwordPlaceholder: "비밀번호를 입력하세요",
    forgotPassword: "비밀번호를 잊으셨나요?",
    loginButton: "로그인",
  },

  en: {
    brandName: "ContentBoost",
    welcomeBack: "Welcome Back",
    subtitle: "Sign in to your account to start AI content management",
    // 🔽 추가
    name: "Name",
    placeholder: "Enter your name",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    forgotPassword: "Forgot your password?",
    loginButton: "Sign In",
  }
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { language } = usePageStore();
  // 🔽 email → name
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const t = loginTranslations[language] || loginTranslations['ko'];

  const handle_login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg('');

    try {
      await loginApi(name, password);
      setAutoLoginEnabled(true); // "로그인 유지"를 활성화합니다.
      setMsg('✅ 로그인 성공');
      navigate('/dashboard'); // 대시보드로 이동
    } catch (err) {
      setMsg('❌ 로그인 오류: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const go_back_to_landing = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <LoginCard
          t={t}
          handle_login={handle_login}
          isLoading={isLoading}
          name={name}
          setName={setName}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          go_back_to_landing={go_back_to_landing}
          nameIcon={User}
          passwordIcon={Lock}
        />
        
        {/* 개발용 임시 대시보드 접근 버튼 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 text-center">
            <Link to="/dashboard">
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm border-2 border-dashed border-gray-400 transition-all duration-200">
                🔧 [개발용] 대시보드 바로가기
              </button>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              개발 환경 전용 - 프로덕션에서는 보이지 않음
            </p>
          </div>
        )}
      </div>

      {msg && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-700 bg-white px-3 py-1 rounded shadow">
          {msg}
        </div>
      )}
    </div>
  );
}
