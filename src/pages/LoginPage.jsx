import { useState } from 'react';
import { usePageStore } from '../stores/page_store.js';
import LoginCard from '../components/login/LoginCard.jsx';
import { User, Lock } from 'lucide-react';

// 🔹 토큰 유틸 + API 호출 가져오기
import { setAccessToken, saveRefreshToken, setRememberMe, setSessionLoggedIn } from '../lib/token.js';
// import { BASE_API_URL } from '../lib/config.js';

const loginTranslations = {
  ko: {
    brandName: "콘텐츠부스트",
    welcomeBack: "다시 오신 것을 환영합니다",
    subtitle: "계정에 로그인하여 AI 콘텐츠 관리를 시작하세요",
    name: "아이디",
    namePlaceholder: "아이디를 입력하세요",
    password: "비밀번호",
    passwordPlaceholder: "비밀번호를 입력하세요",
    forgotPassword: "비밀번호를 잊으셨나요?",
    loginButton: "로그인",
  },
  en: {
    brandName: "ContentBoost",
    welcomeBack: "Welcome Back",
    subtitle: "Sign in to your account to start AI content management",
    name: "Name",
    namePlaceholder: "Enter your name",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    forgotPassword: "Forgot your password?",
    loginButton: "Sign In",
  }
};

export default function LoginPage() {
  const { setCurrentPage, language } = usePageStore();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [autoLogin, setAutoLogin] = useState(false); // ✅ 로그인 유지 체크

  const t = loginTranslations[language] || loginTranslations['ko'];

  const handle_login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg('');

    try {
      const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name,
          password: password
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); // { accessToken, refreshToken }

      if (data.accessToken) {
        // ✅ accessToken은 메모리
        setAccessToken(data.accessToken);

        // ✅ refreshToken은 항상 저장(세션 중 자동 리프레시 필요)
        if (data.refreshToken) saveRefreshToken(data.refreshToken);

        // ✅ rememberMe & session 플래그
        setRememberMe(autoLogin);                              // 영구 옵션
        localStorage.setItem('autoLoginEnabled', String(autoLogin)); // (호환용, 다른 코드에서 참조하면 유지)
        setSessionLoggedIn(true);                              // 현재 세션 유지

        setMsg('✅ 로그인 성공');
        setCurrentPage('dashboard'); // 대시보드로 이동
      } else {
        setMsg('❌ 로그인 실패: 토큰이 없습니다.');
      }
    } catch (err) {
      setMsg('❌ 로그인 오류: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const go_back_to_landing = () => {
    setCurrentPage('landing');
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
          autoLogin={autoLogin}                    // ✅ 체크박스 상태 전달
          onAutoLoginChange={setAutoLogin}         // ✅ 토글 핸들러 전달
        />
      </div>

      {msg && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-700 bg-white px-3 py-1 rounded shadow">
          {msg}
        </div>
      )}
    </div>
  );
}
