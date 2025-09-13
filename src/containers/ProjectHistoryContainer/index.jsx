/**
 * ProjectHistoryContainer 컴포넌트
 * 프로젝트 히스토리 목록과 확장/축소 상태를 관리하는 컨테이너
 * FSD 컨테이너 패턴: 데이터 변환, 상태 관리, 비즈니스 로직 담당
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/common/ui/card';
import { Button } from '@/common/ui/button';
import { Badge } from '@/common/ui/badge';
import { 
  ChevronRight, 
  ChevronDown, 
  FolderOpen, 
  Folder,
  Lightbulb,
  Image,
  FileText,
  Plus,
  RefreshCw,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import ContentTreeView from '@/features/content-tree/ui/ContentTreeView';
import GeneratedVideoPreviewModal from '@/features/content-modals/ui/GeneratedVideoPreviewModal';
import ContentPublishModal from '@/features/content-modals/ui/ContentPublishModal';
import AIMediaRequestModal from '@/features/ai-media-request/ui/AiMediaRequestModal';
import VideoEditModal from '@/features/video-edit/ui/VideoEditModal';
import ConfirmationModal from '@/common/ui/confirmation-modal';
import SuccessModal from '@/common/ui/success-modal';
import TestControlPanel from '@/common/ui/TestControlPanel';
import { use_content_launch } from '@/features/content-management/logic/use-content-launch';
import { use_content_modals } from '@/features/content-modals/logic/use-content-modals';
import { LOCATION_DATA } from '@/common/constants/location-data';
import VersionNavigationSystem from '@/features/version-navigation/ui/VersionNavigationSystem';

/**
 * POI ID로 장소명을 찾는 함수
 * @param {string} poiId - POI ID (예: POI008)
 * @returns {string} 장소명 또는 기본값
 */
function getLocationName(poiId) {
  if (!poiId) return '기타 장소';
  
  for (const district in LOCATION_DATA) {
    const locations = LOCATION_DATA[district];
    if (locations[poiId]) {
      return locations[poiId];
    }
  }
  return '기타 장소';
}

/**
 * 영상 데이터를 장소별로 그룹화하는 함수
 * @param {Array} videos - 영상 데이터 배열
 * @returns {Object} 장소별로 그룹화된 데이터
 */
function groupVideosByLocation(videos) {
  const groups = {};
  
  videos.forEach(video => {
    const locationId = video.location_id || video.poi_id;
    const locationName = getLocationName(locationId);
    
    if (!groups[locationName]) {
      groups[locationName] = {
        id: locationName.replace(/[·\s]/g, '_'), // 안전한 ID 생성
        name: locationName,
        location_id: locationId,
        items: [],
        display_date: null // 장소별 그룹화에서는 날짜 표시 제거
      };
    }
    
    groups[locationName].items.push(video);
  });
  
  return Object.values(groups);
}

/**
 * 소스 타입에 따른 아이콘을 반환
 * @param {string} source_type - 소스 타입 ('prompt', 'upload', 'template')
 * @returns {JSX.Element} 아이콘 컴포넌트
 */
function get_source_icon(source_type) {
  switch (source_type) {
    case 'prompt': 
      return <Lightbulb className="w-4 h-4 text-yellow-500" />;
    case 'upload': 
      return <Image className="w-4 h-4 text-blue-500" />;
    case 'template': 
      return <FileText className="w-4 h-4 text-purple-500" />;
    default: 
      return <Lightbulb className="w-4 h-4 text-yellow-500" />;
  }
}

/**
 * 카테고리별 색상 클래스를 반환
 * @param {string} category - 카테고리 ('social', 'marketing', 'brand', 'event')
 * @returns {string} CSS 클래스명
 */
function get_category_color(category) {
  switch (category) {
    case 'social': 
      return 'bg-green-500/10 text-green-700 dark:text-green-300';
    case 'marketing': 
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'brand': 
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
    case 'event': 
      return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
    case 'location': 
      return 'bg-rose-500/10 text-rose-700 dark:text-rose-300';
    default: 
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
  }
}

/**
 * 카테고리 라벨을 반환
 * @param {string} category - 카테고리 키
 * @returns {string} 한국어 라벨
 */
function get_category_label(category) {
  switch (category) {
    case 'social': return '소셜미디어';
    case 'marketing': return '마케팅';
    case 'brand': return '브랜딩';
    case 'event': return '이벤트';
    case 'location': return '장소별';
    default: return '기타';
  }
}

/**
 * ProjectHistoryContainer 컴포넌트 - FSD 컨테이너 패턴
 * 기존 콘텐츠 론칭 데이터를 프로젝트 히스토리 구조로 변환하여 관리
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.dark_mode - 다크모드 여부
 * @returns {JSX.Element} ProjectHistoryContainer 컴포넌트
 */
function ProjectHistoryContainer({ dark_mode = false }) {
  // 기존 콘텐츠 론칭 로직 활용
  const {
    folders,
    pending_videos,
    uploading_items,
    selected_video_data,
    selected_video_id,
    simulate_upload,
    fetch_folders,
    add_pending_video,
    replace_processing_video,
    select_video,
    handle_multi_platform_publish,
    results_tree
  } = use_content_launch();

  // 모달 상태 관리
  const {
    preview_modal,
    publish_modal,
    publish_form: modal_publish_form,
    open_preview_modal,
    close_preview_modal,
    open_publish_modal,
    close_publish_modal,
    toggle_platform,
    update_publish_form
  } = use_content_modals();

  // 추가 모달 상태
  const [is_request_modal_open, set_is_request_modal_open] = useState(false);
  const [is_edit_modal_open, set_is_edit_modal_open] = useState(false);
  const [is_priority_confirm_modal_open, set_is_priority_confirm_modal_open] = useState(false);
  const [is_priority_mode, set_is_priority_mode] = useState(false);
  const [is_success_modal_open, set_is_success_modal_open] = useState(false);
  const [pending_video_data, set_pending_video_data] = useState(null);
  const [is_publishing, set_is_publishing] = useState(false);

  // 디바운스 타이머 ref
  const debounce_timer_ref = useRef(null);

  // 디바운스된 폴더 갱신 함수 (중복 호출 방지)
  const debouncedFetchFolders = useCallback(() => {
    if (debounce_timer_ref.current) {
      clearTimeout(debounce_timer_ref.current);
    }
    
    debounce_timer_ref.current = setTimeout(() => {
      fetch_folders();
    }, 200); // 200ms 디바운스로 증가하여 과도한 호출 방지
  }, [fetch_folders]);

  // 컴포넌트 마운트 시 강제 fetch_folders 호출 제거
  // Zustand persist가 초기 상태를 복원하므로 별도 초기 페치가 필요하지 않습니다.

  // 🔥 핵심 추가: pending_videos와 folders 변화 시 실시간 동기화 (디바운스 적용)
  useEffect(() => {
    // pending_videos가 변경될 때마다 디바운스된 폴더 목록 갱신
    debouncedFetchFolders();
  }, [pending_videos, debouncedFetchFolders]);

  // 폴더 데이터 변화 감지 및 프로젝트 목록 자동 갱신
  useEffect(() => {
    // folders 데이터 변경 모니터링 (로그 제거)
  }, [folders]);

  // 🔍 상태 동기화 검증 useEffect
  useEffect(() => {
    // 불일치 감지 및 자동 복구 (로그 제거)
    if (pending_videos.length > 0 && folders.length === 0) {
      console.warn('⚠️ [상태 불일치] pending_videos가 있지만 folders가 비어있음 - 자동 복구 시도');
      setTimeout(() => {
        fetch_folders();
      }, 1000);
    }
  }, [pending_videos, folders, fetch_folders]);

  // 테스트 패널과의 연동을 위한 이벤트 리스너 설정
  useEffect(() => {
    const handleTestOpenAIMediaModal = (event) => {
      const { testMode, platform, autoFill, autoSubmit } = event.detail || {};
      if (testMode) {
        set_is_priority_mode(false);
        set_is_request_modal_open(true);
        
        // 테스트 모드 정보를 상태로 저장하여 모달에 전달
        set_pending_video_data({
          testMode: true,
          platform: platform || 'youtube',
          autoFill: autoFill !== false, // 기본값을 true로 변경
          autoSubmit: autoSubmit === true // 명시적으로 true일 때만 자동 제출
        });
        
        
      }
    };

    const handleTestOpenVideoEditModal = (event) => {
      const { testMode, selectedVideo } = event.detail || {};
      if (testMode) {
        set_is_edit_modal_open(true);
        
      }
    };

    const handleTestOpenSuccessModal = (event) => {
      const { message } = event.detail || {};
      set_pending_video_data({ 
        video_data: { title: '테스트 비디오', platform: 'youtube' },
        creation_date: new Date().toISOString(),
        isPriority: false 
      });
      set_is_success_modal_open(true);
      
    };

    const handleTestOpenConfirmationModal = (event) => {
      const { title, message } = event.detail || {};
      set_is_priority_confirm_modal_open(true);
      
    };

    // 이벤트 리스너 등록
    window.addEventListener('test-open-ai-media-modal', handleTestOpenAIMediaModal);
    window.addEventListener('test-open-video-edit-modal', handleTestOpenVideoEditModal);
    window.addEventListener('test-open-success-modal', handleTestOpenSuccessModal);
    window.addEventListener('test-open-confirmation-modal', handleTestOpenConfirmationModal);
    
    // 🌳 트리 구조 테스트 이벤트 리스너
    const handleTreeStructureTest = (event) => {
      const { tree_data, type, message } = event.detail || {};
      
      if (tree_data) {
        
        set_tree_test_data(tree_data);
        set_is_tree_test_mode(true);
        
        // 테스트 모드 알림
        
      }
    };
    
    window.addEventListener('test-tree-structure', handleTreeStructureTest);

    // 클린업
    return () => {
      window.removeEventListener('test-open-ai-media-modal', handleTestOpenAIMediaModal);
      window.removeEventListener('test-open-video-edit-modal', handleTestOpenVideoEditModal);
      window.removeEventListener('test-open-success-modal', handleTestOpenSuccessModal);
      window.removeEventListener('test-open-confirmation-modal', handleTestOpenConfirmationModal);
      window.removeEventListener('test-tree-structure', handleTreeStructureTest);
    };
  }, []);

  // 요청 성공 핸들러 (즉시 UI 업데이트 패턴)
  const handleRequestSuccess = async (requestData) => {
    // 🔥 핵심 수정: 성공 모달을 열기 전에 즉시 데이터 추가
    const { video_data } = requestData;
    
    // 즉시 스토어에 데이터 추가 (이미 use-media-request-form.js에서 처리됨)
    // 여기서는 추가적인 UI 상태 업데이트만 처리
    
    set_pending_video_data(requestData);
    set_is_success_modal_open(true);
    set_is_request_modal_open(false);
    
    // 📊 ProjectHistoryContainer 전용: 새로 생성된 영상의 프로젝트 자동 확장 (poi_id 우선)
    const videoLocationId = video_data.poi_id || video_data.location_id;
    if (videoLocationId) {
      setTimeout(() => {
        const projectId = `project_${videoLocationId}`;
        set_expanded_projects(prev => new Set([...prev, projectId]));
        
      }, 500);
    }
    
    // ⚡ 강화된 즉시 폴더 목록 갱신 - 다중 시도로 확실한 UI 반영 보장
    const ensureUIUpdate = async () => {
      // 첫 번째 시도: 즉시 갱신
      fetch_folders();
      
      // 두 번째 시도: 50ms 후 재갱신 (상태 업데이트 완료 대기)
      setTimeout(() => {
        fetch_folders();
      }, 50);
      
      // 세 번째 시도: 200ms 후 최종 확인 갱신
      setTimeout(() => {
        fetch_folders();
      }, 200);
    };
    
    await ensureUIUpdate();
  };
  
  // 성공 모달 닫기 핸들러 - 더 이상 데이터 추가하지 않음 (이미 완료됨)
  const handleSuccessModalClose = () => {
    set_pending_video_data(null);
    set_is_success_modal_open(false);
    
    // 🔄 최종 확인차 디바운스된 폴더 목록 갱신
    debouncedFetchFolders();
  };

  // 게시 완료 핸들러 (FSD 아키텍처 준수)
  const handle_final_publish = async () => {
    if (!publish_modal.item || !modal_publish_form || is_publishing) return;

    set_is_publishing(true);
    try {
      await handle_multi_platform_publish(modal_publish_form, publish_modal.item);
    } catch (error) {
      console.error('게시 실패:', error);
    } finally {
      set_is_publishing(false);
      close_publish_modal();
    }
  };

  // 프로젝트 확장/축소 상태 관리
  const [expanded_projects, set_expanded_projects] = useState(new Set());
  
  // 🌳 트리 구조 테스트 데이터 상태
  const [tree_test_data, set_tree_test_data] = useState(null);
  const [is_tree_test_mode, set_is_tree_test_mode] = useState(false);

  /**
   * folders와 pending_videos 데이터를 통합하여 projects 구조로 변환
   */
  const convert_to_projects = useCallback(() => {
    // 🔥 folders와 pending_videos를 통합하면서 캐노니컬 ID로 중복 제거
    const canonical = (v) => v?.result_id || v?.id || v?.resultId || v?.temp_id || null;
    const all_videos = [];

    folders.forEach(folder => {
      if (folder.items && folder.items.length > 0) {
        folder.items.forEach(item => {
          all_videos.push(item);
        });
      }
    });

    pending_videos.forEach(video => {
      const vid = canonical(video);
      const exists = all_videos.some(ev => canonical(ev) && canonical(ev) === vid);
      if (!exists) all_videos.push(video);
    });

    // 장소별로 재그룹화
    const location_groups = groupVideosByLocation(all_videos);
    
    return location_groups.map(group => {
      return {
        id: group.id,
        title: group.name, // 장소명으로 표시 (예: 경복궁, 광화문·덕수궁)
        description: `${group.items.length}개의 영상이 포함된 프로젝트`,
        category: 'location', // 카테고리를 location으로 변경
        source_type: 'prompt',
        content_count: group.items.length,
        live_count: group.items.filter(v => v.status === 'completed' || v.status === 'uploaded').length,
        last_activity: '최근 활동',
        location_id: group.location_id // 추가: location ID 정보 보존
      };
    });
  }, [folders, pending_videos]);

  /**
   * folders와 pending_videos 데이터를 통합하여 contents 구조로 변환
   */
  const convert_to_contents = useCallback(() => {
    const all_contents = {};
    const canonical = (v) => v?.result_id || v?.id || v?.resultId || v?.temp_id || null;
    const all_videos = [];

    folders.forEach(folder => {
      if (folder.items && folder.items.length > 0) {
        folder.items.forEach(item => all_videos.push(item));
      }
    });

    pending_videos.forEach(video => {
      const vid = canonical(video);
      const exists = all_videos.some(ev => canonical(ev) && canonical(ev) === vid);
      if (!exists) all_videos.push(video);
    });
    
    // 3. 장소별로 재그룹화
    const location_groups = groupVideosByLocation(all_videos);
    
    location_groups.forEach(group => {
      all_contents[group.id] = group.items.map(video => {
        // 🧪 TEST-ONLY: 디버깅을 위한 로그 (타입 안전 검사 적용)
        const isTestData = (
          (typeof video.temp_id === 'string' && video.temp_id.includes('temp-')) ||
          (typeof video.temp_id === 'number' && video.temp_id > 1700000000000) || // 타임스탬프 기반 숫자 ID 감지
          video.title?.includes('🧪') || 
          video.title?.includes('AI 영상')
        );
        if (isTestData) {
          // 디버그 로그 제거
        }
        
        const canonicalId = video.result_id || video.id || video.resultId || video.temp_id;
        const parentCanonicalId = video.parent_video_id || video.parentId || video.parent_id || video.parentResultId || video.parent_temp_id || null;

        return {
          id: canonicalId,
          result_id: canonicalId,
          title: video.title || '제목 없음',
          type: 'video',
          version: video.version || '1.0', // 버전 정보 활용
          parentId: parentCanonicalId,
          parent_id: parentCanonicalId, // tree-utils.js 호환성
          parent_video_id: parentCanonicalId, // 명시적 부모 ID
          isLive: video.status === 'completed',
          thumbnail: video.thumbnail || video.image_url || '',
          createdAt: video.creation_date || video.createdAt || new Date().toISOString(),
          prompt: video.prompt || video.user_request || '',
          feedback: video.feedback || '',
          resultId: video.resultId || canonicalId,
          status: video.status,
          location_id: video.location_id || video.poi_id, // 장소 정보 보존
          location_name: group.name // 장소명 추가
        };
      });
    });

    return all_contents;
  }, [folders, pending_videos]);

  const projects = convert_to_projects();
  const all_contents = convert_to_contents();

  /**
   * 프로젝트 확장/축소 토글
   * @param {string} project_id - 프로젝트 ID
   */
  const handle_toggle_project = (project_id) => {
    set_expanded_projects(prev => {
      const new_set = new Set(prev);
      if (new_set.has(project_id)) {
        new_set.delete(project_id);
      } else {
        new_set.clear();
        new_set.add(project_id);
      }
      return new_set;
    });
  };

  /**
   * 미리보기 핸들러
   */
  const handle_preview = (item) => {
    open_preview_modal(item);
  };

  /**
   * 게시 핸들러
   */
  const handle_publish = (item) => {
    open_publish_modal(item);
  };

  /**
   * 비디오 수정 핸들러
   */
  const handle_video_edit = (item) => {
    select_video(item.id || item.result_id);
    set_is_edit_modal_open(true);
  };

  // 빈 상태 메시지만 표시 (버튼은 상단에 일관되게 배치)
  const render_empty_state = () => {
    const has_raw_data = folders.length > 0 || pending_videos.length > 0;
    
    return (
      <div className="text-center py-12">
        <Folder className={`w-12 h-12 mx-auto mb-4 ${
          dark_mode ? 'text-gray-600' : 'text-gray-400'
        }`} />
        <h3 className={`mb-2 ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
          {has_raw_data ? '프로젝트를 불러오는 중입니다' : '아직 생성된 프로젝트가 없습니다'}
        </h3>
        <p className={`text-sm ${dark_mode ? 'text-gray-500' : 'text-gray-500'}`}>
          {has_raw_data 
            ? '잠시만 기다려주세요...' 
            : 'AI와 함께 첫 번째 콘텐츠를 만들어보세요'
          }
        </p>
        {process.env.NODE_ENV === 'development' && has_raw_data && (
          <div className={`text-xs mt-2 ${dark_mode ? 'text-yellow-400' : 'text-yellow-600'}`}>
            개발 도구: window.debugProjectHistory.checkSyncStatus()
          </div>
        )}
      </div>
    );
  };

  // 모든 모달들을 렌더링하는 함수
  const render_modals = () => (
    <>
      {/* 기존 모달들 */}
      {preview_modal.open && preview_modal.item && (
        <GeneratedVideoPreviewModal
          is_open={preview_modal.open}
          item={preview_modal.item}
          dark_mode={dark_mode}
          on_close={(e) => {
            // 이벤트 버블링 방지 (트리 패널이 함께 닫히는 것을 방지)
            if (e && e.stopPropagation) {
              e.stopPropagation();
            }
            close_preview_modal();
          }}
          mode="launch"
          on_edit={(_item) => {
            close_preview_modal();
            set_is_edit_modal_open(true);
          }}
        />
      )}

      {publish_modal.open && publish_modal.item && (
        <ContentPublishModal
          is_open={publish_modal.open}
          item={publish_modal.item}
          publish_form={modal_publish_form}
          dark_mode={dark_mode}
          on_close={close_publish_modal}
          on_publish={handle_final_publish}
          on_toggle_platform={toggle_platform}
          on_update_form={update_publish_form}
          is_publishing={is_publishing}
        />
      )}

      {/* 추가 모달들 */}
      <AIMediaRequestModal
        is_open={is_request_modal_open}
        on_close={() => {
          set_is_request_modal_open(false);
          set_pending_video_data(null); // 테스트 데이터도 초기화
        }}
        isPriority={is_priority_mode}
        selectedVideoData={selected_video_data}
        on_request_success={handleRequestSuccess}
        isEditMode={selected_video_data && (selected_video_data.status === 'PROCESSING' || selected_video_data.status === 'ready' || selected_video_data.status === 'uploaded')}
        dark_mode={dark_mode}
        testModeData={pending_video_data?.testMode ? pending_video_data : null} // 테스트 모드 데이터 전달
      />

      {is_edit_modal_open && selected_video_data && (
        <VideoEditModal
          is_open={is_edit_modal_open}
          video_data={selected_video_data}
          dark_mode={dark_mode}
          on_close={() => set_is_edit_modal_open(false)}
          on_save={(edited_data) => {
            
            set_is_edit_modal_open(false);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={is_priority_confirm_modal_open}
        onClose={() => set_is_priority_confirm_modal_open(false)}
        onConfirm={() => {
          set_is_priority_mode(true);
          set_is_request_modal_open(true);
          set_is_priority_confirm_modal_open(false);
        }}
        title="영상 생성 작업 교체"
        message="현재 생성 중인 영상 생성이 중단되고 새롭게 생성을 시작합니다."
      />
      
      <SuccessModal
        is_open={is_success_modal_open}
        on_close={handleSuccessModalClose}
        message="AI 미디어 제작 요청이 성공적으로 전송되었습니다!"
        title="요청 완료"
      />

      {/* 테스트 컨트롤 패널 (개발 환경에서만 표시) */}
      {process.env.NODE_ENV === 'development' && (
        <TestControlPanel dark_mode={dark_mode} />
      )}
    </>
  );

  // 공통 액션 버튼 섹션 렌더링 함수
  const render_action_buttons = () => (
    <div className="flex items-start justify-between gap-4 mb-6">
      {/* 버튼 영역 */}
      <div className="flex items-start gap-4">
        {/* 새로운 미디어 제작 요청 버튼 */}
        <div className="flex flex-col">
          <Button
            onClick={() => {
              set_is_priority_mode(false);
              set_is_request_modal_open(true);
            }}
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 text-gray-800 dark:text-white shadow-lg font-semibold rounded-2xl"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            새로운 미디어 제작 요청
          </Button>
          
          <p className={`text-xs mt-2 ${dark_mode ? 'text-blue-200/80' : 'text-blue-600/70'} font-medium max-w-xs`}>
            AI로 새로운 영상을 생성합니다
          </p>
        </div>

        {/* 영상 수정 요청 버튼 */}
        {selected_video_data && (selected_video_data.status === 'PROCESSING' || selected_video_data.status === 'ready' || selected_video_data.status === 'uploaded') && (
          <div className="flex flex-col">
            <Button
              onClick={() => {
                set_is_edit_modal_open(true);
              }}
              className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 hover:from-orange-500/30 hover:to-red-500/30 text-orange-600 dark:text-orange-300 shadow-lg font-semibold rounded-2xl"
              size="lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              영상 수정하기
            </Button>
            
            <p className={`text-xs mt-2 ${dark_mode ? 'text-orange-200/80' : 'text-orange-600/70'} font-medium max-w-xs`}>
              프롬프트만 입력하여 {selected_video_data.title}의 새로운 버전을 생성합니다
            </p>
          </div>
        )}
      </div>
      
      {/* 통계 정보 */}
      <div className="flex items-center gap-4">
        <div className={`${ 
          dark_mode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } rounded-xl px-4 py-2 border shadow-sm`}>
          <div className="text-center">
            <div className={`text-lg font-bold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
              {folders.reduce((sum, folder) => sum + folder.item_count, 0)}
            </div>
            <div className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>총 콘텐츠</div>
          </div>
        </div>
        
        <div className={`${
          dark_mode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } rounded-xl px-4 py-2 border shadow-sm`}>
          <div className="text-center">
            <div className={`text-lg font-bold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
              {folders.length}
            </div>
            <div className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>프로젝트</div>
          </div>
        </div>
        
        {/* 데이터 초기화 버튼 */}
        {pending_videos.length > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                localStorage.removeItem('content-launch-storage');
                window.location.reload();
              }}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg"
              size="sm"
            >
              데이터 초기화
            </Button>
          </div>
        )}
        
        {/* 🌳 트리 테스트 모드 상태 표시 */}
        {is_tree_test_mode && (
          <div className={`${
            dark_mode 
              ? 'bg-emerald-800 border-emerald-600' 
              : 'bg-emerald-50 border-emerald-200'
          } rounded-xl px-4 py-2 border shadow-sm`}>
            <div className="flex items-center gap-2">
              <div className={`text-xs font-medium ${dark_mode ? 'text-emerald-200' : 'text-emerald-700'}`}>
                트리 테스트 모드
              </div>
              <Button
                onClick={() => {
                  set_is_tree_test_mode(false);
                  set_tree_test_data(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2 py-1 rounded"
                size="sm"
              >
                해제
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );


  return (
    <div className="space-y-4">
      {/* 항상 상단에 배치되는 액션 버튼 섹션 */}
      {render_action_buttons()}

      {/* 트리 우선 표시: 결과 트리가 있으면 폴더 대신 트리 카드만 렌더 */}
      {results_tree && results_tree.length > 0 ? (
        <Card className={`overflow-hidden backdrop-blur-md border ${
          dark_mode 
            ? 'bg-gray-900/50 border-gray-700/50' 
            : 'bg-white/50 border-gray-300/50'
        }`}>
          <div className="p-4">
            <VersionNavigationSystem
              treeData={results_tree}
              contents={undefined}
              darkMode={dark_mode}
              uploadingItems={uploading_items}
              onPreview={handle_preview}
              onPublish={handle_publish}
              onEdit={handle_video_edit}
            />
          </div>
        </Card>
      ) : (
      <>
      {/* 빈 상태일 때만 메시지 표시 */}
      {projects.length === 0 && render_empty_state()}
      {projects.map((project) => {
        const is_expanded = expanded_projects.has(project.id);
        const project_contents = all_contents[project.id] || [];

        return (
          <Card key={project.id} className={`overflow-hidden backdrop-blur-md border ${
            dark_mode 
              ? 'bg-gray-900/50 border-gray-700/50' 
              : 'bg-white/50 border-gray-300/50'
          }`}>
            {/* 프로젝트 헤더 */}
            <Button
              variant="ghost"
              className="w-full p-4 h-auto justify-between hover:bg-accent/50 transition-all duration-200"
              onClick={() => handle_toggle_project(project.id)}
            >
              <div className="flex items-center gap-4 flex-1">
                {/* 정사각형 폴더 아이콘 */}
                <motion.div
                  animate={{
                    scale: is_expanded ? 1.05 : 1
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                  style={{ transformOrigin: 'center center' }}
                  className="relative"
                >
                  <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${
                    is_expanded
                      ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                      : `${dark_mode ? 'bg-gray-700/50 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'}`
                  }`}>
                    {is_expanded ? (
                      <FolderOpen className="w-4 h-4" />
                    ) : (
                      <Folder className="w-4 h-4" />
                    )}
                  </div>
                  
                </motion.div>

                {/* 프로젝트 정보 */}
                <div className="text-left flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium">{project.title}</div>
                    
                    {/* 카테고리 배지 */}
                    <Badge className={`text-xs ${get_category_color(project.category)}`}>
                      {get_category_label(project.category)}
                    </Badge>
                    
                    {/* 라이브 카운트 */}
                    {project.live_count > 0 && (
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 text-xs">
                        {project.live_count}개 라이브
                      </Badge>
                    )}
                  </div>

                  {/* 버전 네비게이션 시스템이 확장되면 여기에 표시됨 */}

                  <div className={`text-sm mb-2 ${
                    dark_mode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {project.description}
                  </div>

                  <div className={`flex items-center gap-4 text-xs ${
                    dark_mode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {/* 소스 정보 */}
                    <div className="flex items-center gap-1">
                      {get_source_icon(project.source_type)}
                      {project.source_file ? project.source_file : '프롬프트 기반'}
                    </div>
                    
                    <div>총 {project.content_count}개 콘텐츠</div>
                    <div>마지막 활동: {project.last_activity}</div>
                  </div>
                </div>
              </div>

              {/* 펼치기/접기 아이콘 */}
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ 
                    rotate: is_expanded ? 90 : 0
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                  className={`p-1 rounded-full transition-colors duration-300 ${
                    is_expanded 
                      ? 'bg-blue-500/10' 
                      : 'hover:bg-gray-500/10'
                  }`}
                >
                  <ChevronRight className={`w-4 h-4 ${
                    is_expanded ? 'text-blue-500' : ''
                  }`} />
                </motion.div>
              </div>
            </Button>

            {/* 확장된 콘텐츠 영역 */}
            {is_expanded && (
              <motion.div
                initial={{ 
                  opacity: 0, 
                  height: 0, 
                  scale: 0.95,
                  rotateX: -10 
                }}
                animate={{ 
                  opacity: 1, 
                  height: 'auto', 
                  scale: 1,
                  rotateX: 0 
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0, 
                  scale: 0.95,
                  rotateX: -10 
                }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94] // 폴더와 동일한 easing
                }}
                style={{ transformOrigin: 'top center' }}
                className={`border-t ${dark_mode ? 'border-gray-700/50' : 'border-gray-300/50'} ${
                  dark_mode ? 'bg-gray-800/30' : 'bg-gray-50/30'
                }`}
              >
                <div className="p-4">
                  {/* 새로운 버전 네비게이션 시스템 */}
                  <VersionNavigationSystem
                    treeData={is_tree_test_mode ? tree_test_data : (results_tree && results_tree.length ? results_tree : null)}
                    contents={!is_tree_test_mode && (!results_tree || results_tree.length === 0) ? project_contents : undefined}
                    darkMode={dark_mode}
                    uploadingItems={uploading_items}
                    onPreview={handle_preview}
                    onPublish={handle_publish}
                    onEdit={handle_video_edit}
                  />
                </div>
              </motion.div>
            )}
          </Card>
        );
      })}
      </>
      )}

      {/* 모든 모달들 */}
      {render_modals()}
    </div>
  );
}

export default React.memo(ProjectHistoryContainer);
