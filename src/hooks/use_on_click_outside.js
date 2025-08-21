/**
 * 외부 클릭 감지 커스텀 훅
 * @param {React.RefObject} ref - 감지할 DOM 요소의 ref
 * @param {Function} handler - 외부 클릭 시 실행될 핸들러 함수
 */
import { useEffect } from 'react';

export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // ref가 없거나, ref의 DOM 요소가 event.target을 포함하면 아무것도 하지 않음
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // 클린업 함수: 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // ref와 handler가 변경될 때만 effect를 재실행
};