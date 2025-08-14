/**
 * 섹션 래퍼 컴포넌트
 * @param {object} props
 * @param {React.ReactNode} props.children - 섹션 내용
 * @param {string} props.className - 추가 CSS 클래스
 * @param {string} props.id - 섹션 ID
 */
export default function Section({ 
  children, 
  className = "",
  id
}) {
  return (
    <section id={id} className={`relative min-h-screen flex items-center justify-start py-20 ${className}`}>
      <div className="w-full px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}