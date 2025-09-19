import { useEffect, useRef } from 'react';
import { use_content_launch } from './use-content-launch';

// 폴링 간격 (30초)
const POLLING_INTERVAL_MS = 30000;

/**
 * [신규] 'PROCESSING' 상태를 감시하고 자동으로 데이터를 새로고침하는 훅.
 * 기존 로직에 전혀 영향을 주지 않고 독립적으로 동작합니다.
 */
export const useStatusMonitor = () => {
  const { folders, fetch_folders } = use_content_launch(state => ({
    folders: state.folders,
    fetch_folders: state.fetch_folders,
  }));

  const interval_id_ref = useRef(null);

  useEffect(() => {
    // 'PROCESSING' 상태인 항목이 있는지 확인합니다.
    const has_processing_items = folders.some(
      folder =>
        folder.status === 'PROCESSING' ||
        folder.children?.some(child => child.status === 'PROCESSING')
    );

    // 처리 중인 항목이 있고, 폴링이 시작되지 않았다면 폴링을 시작합니다.
    if (has_processing_items && !interval_id_ref.current) {
      interval_id_ref.current = setInterval(() => {
        fetch_folders();
      }, POLLING_INTERVAL_MS);
    }
    // 처리 중인 항목이 없는데, 폴링이 실행 중이라면 폴링을 중단합니다.
    else if (!has_processing_items && interval_id_ref.current) {
      clearInterval(interval_id_ref.current);
      interval_id_ref.current = null;
    }

    // 컴포넌트가 언마운트될 때 인터벌을 정리합니다.
    return () => {
      if (interval_id_ref.current) {
        clearInterval(interval_id_ref.current);
        interval_id_ref.current = null;
      }
    };
  }, [folders, fetch_folders]);
};
