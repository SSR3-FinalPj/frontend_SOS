/**
 * AuthLayout 블록
 * 인증 관련 페이지에서 사용하는 레이아웃 구조
 */

/**
 * AuthLayout 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 메인 콘텐츠
 * @returns {JSX.Element} AuthLayout 컴포넌트
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;