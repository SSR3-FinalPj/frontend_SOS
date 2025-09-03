import React from 'react';

/**
 * Meaire 브랜드 로고 컴포넌트
 * @param {object} props - 컴포넌트 props
 * @param {number} [props.size=32] - 로고 SVG의 크기 (가로/세로 동일)
 * @param {string} [props.className=""] - 추가적인 Tailwind CSS 클래스
 * @param {boolean} [props.showText=true] - 로고 옆에 "Meaire" 텍스트 표시 여부
 * @param {'light' | 'dark'} [props.variant='light'] - 로고 색상 변형 (라이트/다크 모드용)
 */
export function MeaireLogo({ 
  size = 32, 
  className = "", 
  showText = true, 
  variant = 'light' 
}) {
  const gradientId = `meaire-gradient-${React.useId()}`;
  const glowId = `meaire-glow-${React.useId()}`;
  const echoId = `meaire-echo-${React.useId()}`;
  
  // 색상 변형
  const colors = variant === 'dark' ? {
    primary: '#60A5FA',
    secondary: '#A78BFA',
    middle: '#818CF8'
  } : {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    middle: '#6366F1'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 48 48">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
          <linearGradient id={glowId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.4" />
            <stop offset="50%" stopColor={colors.middle} stopOpacity="0.6" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id={echoId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.secondary} stopOpacity="0.3" />
            <stop offset="100%" stopColor={colors.primary} stopOpacity="0.1" />
          </radialGradient>
        </defs>
        
        {/* 메아리 동심원들 (음파) */}
        <circle 
          cx="24" 
          cy="24" 
          r={size > 40 ? "20" : size > 32 ? "18" : "16"} 
          fill="none" 
          stroke={`url(#${gradientId})`} 
          strokeWidth="0.6" 
          opacity={variant === 'dark' ? "0.25" : "0.2"}
        />
        <circle 
          cx="24" 
          cy="24" 
          r={size > 40 ? "16" : size > 32 ? "14" : "12"} 
          fill="none" 
          stroke={`url(#${gradientId})`} 
          strokeWidth="0.8" 
          opacity={variant === 'dark' ? "0.35" : "0.3"}
        />
        <circle 
          cx="24" 
          cy="24" 
          r={size > 40 ? "12" : size > 32 ? "10" : "8"} 
          fill="none" 
          stroke={`url(#${gradientId})`} 
          strokeWidth="1" 
          opacity={variant === 'dark' ? "0.45" : "0.4"}
        />
        
        {/* 뉴런 네트워크 노드들 (8개 원형 배치) */}
        {size > 24 && (
          <>
            <circle 
              cx={size > 40 ? "10" : size > 32 ? "12" : "14"} 
              cy={size > 40 ? "18" : size > 32 ? "20" : "20"} 
              r={size > 40 ? "1.5" : size > 32 ? "1.2" : "1"} 
              fill={`url(#${gradientId})`} 
              opacity={variant === 'dark' ? "0.9" : "0.8"}
            />
            <circle 
              cx={size > 40 ? "18" : size > 32 ? "20" : "20"} 
              cy={size > 40 ? "10" : size > 32 ? "12" : "14"} 
              r={size > 40 ? "1.5" : size > 32 ? "1.2" : "1"} 
              fill={`url(#${gradientId})`} 
              opacity={variant === 'dark' ? "0.9" : "0.8"}
            />
            <circle 
              cx={size > 40 ? "30" : size > 32 ? "28" : "28"} 
              cy={size > 40 ? "10" : size > 32 ? "12" : "14"} 
              r={size > 40 ? "1.5" : size > 32 ? "1.2" : "1"} 
              fill={`url(#${gradientId})`} 
              opacity={variant === 'dark' ? "0.9" : "0.8"}
            />
            <circle 
              cx={size > 40 ? "38" : size > 32 ? "36" : "34"} 
              cy={size > 40 ? "18" : size > 32 ? "20" : "20"} 
              r={size > 40 ? "1.5" : size > 32 ? "1.2" : "1"} 
              fill={`url(#${gradientId})`} 
              opacity={variant === 'dark' ? "0.9" : "0.8"}
            />
            <circle 
              cx={size > 40 ? "38" : size > 32 ? "36" : "34"} 
              cy={size > 40 ? "30" : size > 32 ? "28" : "28"} 
              r={size > 40 ? "1.5" : size > 32 ? "1.2" : "1"} 
              fill={`url(#${gradientId})`} 
              opacity={variant === 'dark' ? "0.9" : "0.8"}
            />
            <circle 
              cx={size > 40 ? "30" : size > 32 ? "28" : "28"} 
              cy={size > 40 ? "38" : size > 32 ? "36" : "34"} 
              r={size > 40 ? "1.5" : size > 32 ? "1.2" : "1"} 
              fill={`url(#${gradientId})`} 
              opacity={variant === 'dark' ? "0.9" : "0.8"}
            />
            <circle 
              cx={size > 40 ? "18" : size > 32 ? "20" : "20"} 
              cy={size > 40 ? "38" : size > 32 ? "36" : "34"} 
              r={size > 40 ? "1.5" : size > 32 ? "1.2" : "1"} 
              fill={`url(#${gradientId})`} 
              opacity={variant === 'dark' ? "0.9" : "0.8"}
            />
            <circle 
              cx={size > 40 ? "10" : size > 32 ? "12" : "14"} 
              cy={size > 40 ? "30" : size > 32 ? "28" : "28"} 
              r={size > 40 ? "1.5" : size > 32 ? "1.2" : "1"} 
              fill={`url(#${gradientId})`} 
              opacity={variant === 'dark' ? "0.9" : "0.8"}
            />
          </>
        )}
        
        {/* 뉴런 연결선들 (메아리처럼 퍼져나가는) */}
        {size > 24 && (
          <>
            <path 
              d={`M 24 24 L ${size > 40 ? "10" : size > 32 ? "12" : "14"} ${size > 40 ? "18" : size > 32 ? "20" : "20"}`} 
              stroke={`url(#${glowId})`} 
              strokeWidth={size > 40 ? "1" : "0.8"} 
              opacity={variant === 'dark' ? "0.5" : "0.4"} 
              strokeLinecap="round"
            />
            <path 
              d={`M 24 24 L ${size > 40 ? "18" : size > 32 ? "20" : "20"} ${size > 40 ? "10" : size > 32 ? "12" : "14"}`} 
              stroke={`url(#${glowId})`} 
              strokeWidth={size > 40 ? "1" : "0.8"} 
              opacity={variant === 'dark' ? "0.5" : "0.4"} 
              strokeLinecap="round"
            />
            <path 
              d={`M 24 24 L ${size > 40 ? "30" : size > 32 ? "28" : "28"} ${size > 40 ? "10" : size > 32 ? "12" : "14"}`} 
              stroke={`url(#${glowId})`} 
              strokeWidth={size > 40 ? "1" : "0.8"} 
              opacity={variant === 'dark' ? "0.5" : "0.4"} 
              strokeLinecap="round"
            />
            <path 
              d={`M 24 24 L ${size > 40 ? "38" : size > 32 ? "36" : "34"} ${size > 40 ? "18" : size > 32 ? "20" : "20"}`} 
              stroke={`url(#${glowId})`} 
              strokeWidth={size > 40 ? "1" : "0.8"} 
              opacity={variant === 'dark' ? "0.5" : "0.4"} 
              strokeLinecap="round"
            />
            <path 
              d={`M 24 24 L ${size > 40 ? "38" : size > 32 ? "36" : "34"} ${size > 40 ? "30" : size > 32 ? "28" : "28"}`} 
              stroke={`url(#${glowId})`} 
              strokeWidth={size > 40 ? "1" : "0.8"} 
              opacity={variant === 'dark' ? "0.5" : "0.4"} 
              strokeLinecap="round"
            />
            <path 
              d={`M 24 24 L ${size > 40 ? "30" : size > 32 ? "28" : "28"} ${size > 40 ? "38" : size > 32 ? "36" : "34"}`} 
              stroke={`url(#${glowId})`} 
              strokeWidth={size > 40 ? "1" : "0.8"} 
              opacity={variant === 'dark' ? "0.5" : "0.4"} 
              strokeLinecap="round"
            />
            <path 
              d={`M 24 24 L ${size > 40 ? "18" : size > 32 ? "20" : "20"} ${size > 40 ? "38" : size > 32 ? "36" : "34"}`} 
              stroke={`url(#${glowId})`} 
              strokeWidth={size > 40 ? "1" : "0.8"} 
              opacity={variant === 'dark' ? "0.5" : "0.4"} 
              strokeLinecap="round"
            />
            <path 
              d={`M 24 24 L ${size > 40 ? "10" : size > 32 ? "12" : "14"} ${size > 40 ? "30" : size > 32 ? "28" : "28"}`} 
              stroke={`url(#${glowId})`} 
              strokeWidth={size > 40 ? "1" : "0.8"} 
              opacity={variant === 'dark' ? "0.5" : "0.4"} 
              strokeLinecap="round"
            />
          </>
        )}
        
        {/* 보조 연결선들 (네트워크 복잡성) */}
        {size > 32 && (
          <>
            <path 
              d={`M ${size > 40 ? "18" : "20"} ${size > 40 ? "10" : "12"} L ${size > 40 ? "30" : "28"} ${size > 40 ? "10" : "12"}`} 
              stroke={`url(#${gradientId})`} 
              strokeWidth="0.8" 
              opacity={variant === 'dark' ? "0.4" : "0.3"} 
              strokeLinecap="round"
            />
            <path 
              d={`M ${size > 40 ? "38" : "36"} ${size > 40 ? "18" : "20"} L ${size > 40 ? "38" : "36"} ${size > 40 ? "30" : "28"}`} 
              stroke={`url(#${gradientId})`} 
              strokeWidth="0.8" 
              opacity={variant === 'dark' ? "0.4" : "0.3"} 
              strokeLinecap="round"
            />
            <path 
              d={`M ${size > 40 ? "18" : "20"} ${size > 40 ? "38" : "36"} L ${size > 40 ? "30" : "28"} ${size > 40 ? "38" : "36"}`} 
              stroke={`url(#${gradientId})`} 
              strokeWidth="0.8" 
              opacity={variant === 'dark' ? "0.4" : "0.3"} 
              strokeLinecap="round"
            />
            <path 
              d={`M ${size > 40 ? "10" : "12"} ${size > 40 ? "18" : "20"} L ${size > 40 ? "10" : "12"} ${size > 40 ? "30" : "28"}`} 
              stroke={`url(#${gradientId})`} 
              strokeWidth="0.8" 
              opacity={variant === 'dark' ? "0.4" : "0.3"} 
              strokeLinecap="round"
            />
          </>
        )}
        
        {/* 중앙 AI 코어 */}
        <circle 
          cx="24" 
          cy="24" 
          r={size > 40 ? "6" : size > 32 ? "5" : "4"} 
          fill={`url(#${echoId})`} 
          opacity={variant === 'dark' ? "0.7" : "0.6"}
        />
        <circle 
          cx="24" 
          cy="24" 
          r={size > 40 ? "3" : "2.5"} 
          fill={`url(#${gradientId})`} 
          opacity={variant === 'dark' ? "0.95" : "0.9"}
        />
        <circle 
          cx="24" 
          cy="24" 
          r={size > 40 ? "1.5" : "1"} 
          fill="#FFFFFF" 
          opacity={variant === 'dark' ? "0.98" : "0.95"}
        />
      </svg>
      
      {showText && (
        <span className={`font-bold tracking-tight ${size > 32 ? 'text-2xl' : 'text-lg'}`}>
          Meaire
        </span>
      )}
    </div>
  );
}

/**
 * Meaire 로고 마크 컴포넌트 (텍스트 없음)
 * @param {object} props - 컴포넌트 props
 * @param {number} [props.size=32] - 로고 마크의 크기
 * @param {'light' | 'dark'} [props.variant='light'] - 로고 색상 변형
 * @param {string} [props.className=""] - 추가적인 Tailwind CSS 클래스
 */
export function MeaireLogoMark({ 
  size = 32, 
  variant = 'light',
  className = ""
}) {
  return (
    <div className={className}>
      <MeaireLogo 
        size={size} 
        showText={false} 
        variant={variant} 
      />
    </div>
  );
}