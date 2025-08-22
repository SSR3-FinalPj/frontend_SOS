/**
 * Timer 컴포넌트
 * 시작 시간부터 현재까지의 경과 시간을 실시간으로 표시하는 재사용 가능한 컴포넌트
 */

import React, { useEffect, useState } from 'react';

/**
 * Timer 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.startTime - 시작 시간 (ISO 형식 문자열)
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {string} [props.format='MM:SS'] - 시간 표시 형식 ('MM:SS' 또는 'HH:MM:SS')
 * @returns {JSX.Element} Timer 컴포넌트
 */
const Timer = ({ startTime, className = '', format = 'MM:SS' }) => {
  const [elapsedTime, setElapsedTime] = useState('00:00');
  
  useEffect(() => {
    if (!startTime) {
      setElapsedTime('00:00');
      return;
    }
    
    const updateTime = () => {
      const now = new Date();
      const start = new Date(startTime);
      const diff = Math.floor((now - start) / 1000);
      
      if (diff < 0) {
        setElapsedTime('00:00');
        return;
      }
      
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      
      if (format === 'HH:MM:SS') {
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      } else {
        setElapsedTime(
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    };
    
    // 즉시 한 번 실행
    updateTime();
    
    // 1초마다 업데이트
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, format]);
  
  return (
    <span className={`font-mono ${className}`}>
      {elapsedTime}
    </span>
  );
};

export default Timer;