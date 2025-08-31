import AuthLayout from '@/containers/AuthLayout';
import LoginView from '@/containers/LoginView';

/**
 * LoginPage 컴포넌트
 * 로그인 페이지를 위한 레이아웃과 뷰 조립
 */
export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginView />
    </AuthLayout>
  );
}
