/**
 * LoginView 블록
 * 로그인 페이지의 메인 콘텐츠를 담당하는 뷰 블록
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageStore } from '@/common/stores/page-store';
import LoginCard from '@/features/auth/ui/LoginCard';
import { User, Lock } from 'lucide-react';
import { loginApi } from '@/common/lib/auth-bootstrap';

const loginTranslations = {
  ko: {
    brandName: "콘텐츠부스트",
    welcomeBack: "다시 오신 것을 환영합니다",
    subtitle: "계정에 로그인하여 AI 콘텐츠 관리를 시작하세요",
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
    name: "Name",
    placeholder: "Enter your name",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    forgotPassword: "Forgot your password?",
    loginButton: "Sign In",
  }
};

/**
 * LoginView 컴포넌트
 * 로그인 폼과 상태 관리를 담당하는 뷰 블록
 */
const LoginView = () => {
  const navigate = useNavigate();
  const { language } = usePageStore();
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
      setMsg('✅ 로그인 성공');
      navigate('/dashboard');
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
    <>
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
      
      {msg && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-700 bg-white px-3 py-1 rounded shadow">
          {msg}
        </div>
      )}
    </>
  );
};

export default LoginView;