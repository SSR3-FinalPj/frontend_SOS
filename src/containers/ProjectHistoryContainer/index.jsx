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
  RefreshCw
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
    handle_multi_platform_publish
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

  // 디바운스 타이머 ref
  const debounce_timer_ref = useRef(null);

  // 디바운스된 폴더 갱신 함수 (중복 호출 방지)
  const debouncedFetchFolders = useCallback(() => {
    if (debounce_timer_ref.current) {
      clearTimeout(debounce_timer_ref.current);
    }
    
    debounce_timer_ref.current = setTimeout(() => {
      fetch_folders();
      console.log('[디바운스] 폴더 목록 갱신 실행');
    }, 200); // 200ms 디바운스로 증가하여 과도한 호출 방지
  }, [fetch_folders]);

  // 컴포넌트 마운트 시 폴더 데이터 로딩 및 실시간 동기화
  useEffect(() => {
    fetch_folders();
    
    // 🔍 개발 환경에서만 디버그 기능 활성화
    if (process.env.NODE_ENV === 'development') {
      console.log('[ProjectHistoryContainer] 컴포넌트 마운트됨 - 초기 폴더 로딩');
      
      // 전역 디버그 함수 등록 (함수 정의 후에 접근하도록 지연)
      setTimeout(() => {
        window.debugProjectHistory = {
          checkSyncStatus: () => {
            console.log('[디버그] 현재 동기화 상태:', {
              folders_count: folders.length,
              pending_videos_count: pending_videos.length,
              folders: folders,
              pending_videos: pending_videos
            });
          },
          forceFolderUpdate: () => {
            console.log('[디버그] 강제 폴더 업데이트 실행');
            fetch_folders();
          },
          clearData: () => {
            localStorage.removeItem('content-launch-storage');
            window.location.reload();
          }
        };
      }, 100);
      
      console.log('[ProjectHistoryContainer] 디버그 기능 활성화됨 - window.debugProjectHistory 사용 가능');
    }
  }, [fetch_folders]);

  // 🔥 핵심 추가: pending_videos와 folders 변화 시 실시간 동기화 (디바운스 적용)
  useEffect(() => {
    // pending_videos가 변경될 때마다 디바운스된 폴더 목록 갱신
    debouncedFetchFolders();
  }, [pending_videos, debouncedFetchFolders]);

  // 폴더 데이터 변화 감지 및 프로젝트 목록 자동 갱신
  useEffect(() => {
    // folders 데이터가 변경되면 convert_to_projects가 자동으로 호출되어 UI가 업데이트됨
    if (process.env.NODE_ENV === 'development') {
      console.log(`[상태 모니터링] folders 변경됨 - 개수: ${folders.length}`, folders);
    }
  }, [folders]);

  // 🔍 상태 동기화 검증 useEffect
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[상태 검증] pending_videos: ${pending_videos.length}, folders: ${folders.length}`);
      
      // 불일치 감지 및 자동 복구
      if (pending_videos.length > 0 && folders.length === 0) {
        console.warn('⚠️ [상태 불일치] pending_videos가 있지만 folders가 비어있음 - 자동 복구 시도');
        // 자동 복구: 1초 후 강제 폴더 갱신
        setTimeout(() => {
          console.log('🔄 [자동 복구] 폴더 목록 강제 갱신 실행');
          fetch_folders();
        }, 1000);
      }
      
      if (pending_videos.length === 0 && folders.length > 0) {
        console.warn('⚠️ [상태 불일치] folders가 있지만 pending_videos가 비어있음');
        // 이 경우는 정상일 수 있음 (모든 영상이 완료되거나 삭제된 경우)
      }
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
          autoFill: autoFill || false,
          autoSubmit: autoSubmit || false
        });
        
        console.log(`[TEST] AI 미디어 요청 모달 열기 - 플랫폼: ${platform}, 자동채움: ${autoFill}, 자동제출: ${autoSubmit}`);
      }
    };

    const handleTestOpenVideoEditModal = (event) => {
      const { testMode, selectedVideo } = event.detail || {};
      if (testMode) {
        set_is_edit_modal_open(true);
        console.log(`[TEST] 비디오 수정 모달 열기 - 비디오:`, selectedVideo);
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
      console.log(`[TEST] 성공 모달 열기 - 메시지: ${message}`);
    };

    const handleTestOpenConfirmationModal = (event) => {
      const { title, message } = event.detail || {};
      set_is_priority_confirm_modal_open(true);
      console.log(`[TEST] 확인 모달 열기 - 제목: ${title}, 메시지: ${message}`);
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
        console.log(`[트리 테스트] ${type} 트리 구조 데이터 수신:`, tree_data);
        set_tree_test_data(tree_data);
        set_is_tree_test_mode(true);
        
        // 테스트 모드 알림
        if (message) {
          console.log(`[트리 테스트] ${message}`);
        }
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
        console.log(`[UI 동기화] 파일 생성 요청 후 UI 업데이트 완료 - ${video_data.title}`);
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
    if (!publish_modal.item || !modal_publish_form) return;

    try {
      await handle_multi_platform_publish(modal_publish_form, publish_modal.item);
    } catch (error) {
      console.error('게시 실패:', error);
    } finally {
      close_publish_modal();
    }
  };

  // 프로젝트 확장/축소 상태 관리
  const [expanded_projects, set_expanded_projects] = useState(new Set());
  
  // 🌳 트리 구조 테스트 데이터 상태
  const [tree_test_data, set_tree_test_data] = useState(null);
  const [is_tree_test_mode, set_is_tree_test_mode] = useState(false);

  /**
   * 기존 folders 데이터를 projects 구조로 변환
   */
  const convert_to_projects = useCallback(() => {
    return folders.map(folder => {
      // 🔥 핵심 수정: folder.videos → folder.items로 변경, folder.id 안전성 보장
      const items = folder.items || [];
      const folder_id = folder.id || folder.date; // date를 fallback ID로 사용
      
      return {
        id: folder_id,
        title: folder.name || folder.display_date || folder.date,
        description: `${items.length}개의 영상이 포함된 프로젝트`,
        category: 'social',
        source_type: 'prompt',
        content_count: items.length,
        live_count: items.filter(v => v.status === 'completed' || v.status === 'uploaded').length,
        last_activity: '최근 활동'
      };
    });
  }, [folders]);

  /**
   * 기존 videos 데이터를 contents 구조로 변환
   */
  const convert_to_contents = useCallback(() => {
    const all_contents = {};
    
    folders.forEach(folder => {
      // 🔥 핵심 수정: folder.videos → folder.items로 변경
      const items = folder.items || [];
      console.log(`[convert_to_contents] 폴더 "${folder.date}" 아이템 개수: ${items.length}`, items);
      
      all_contents[folder.id || folder.date] = items.map(video => ({
        id: video.id || video.temp_id || video.resultId,
        title: video.title || '제목 없음',
        type: 'video',
        version: '1.0',
        parentId: null,
        isLive: video.status === 'completed',
        thumbnail: video.thumbnail || video.image_url || '',
        createdAt: video.creation_date || video.createdAt || new Date().toISOString(),
        prompt: video.prompt || video.user_request || '',
        feedback: video.feedback || '',
        resultId: video.resultId,
        status: video.status
      }));
    });

    console.log(`[convert_to_contents] 변환된 all_contents:`, all_contents);
    return all_contents;
  }, [folders]);

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

  // 빈 상태 메시지만 표시 (버튼은 상단에 일관되게 배치)
  const render_empty_state = () => (
    <div className="text-center py-12">
      <Folder className={`w-12 h-12 mx-auto mb-4 ${
        dark_mode ? 'text-gray-600' : 'text-gray-400'
      }`} />
      <h3 className={`mb-2 ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
        아직 생성된 프로젝트가 없습니다
      </h3>
      <p className={`text-sm ${dark_mode ? 'text-gray-500' : 'text-gray-500'}`}>
        AI와 함께 첫 번째 콘텐츠를 만들어보세요
      </p>
    </div>
  );

  // 모든 모달들을 렌더링하는 함수
  const render_modals = () => (
    <>
      {/* 기존 모달들 */}
      {preview_modal.open && preview_modal.item && (
        <GeneratedVideoPreviewModal
          is_open={preview_modal.open}
          item={preview_modal.item}
          dark_mode={dark_mode}
          on_close={close_preview_modal}
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
        testModeData={pending_video_data?.testMode ? pending_video_data : null}
      />

      {is_edit_modal_open && selected_video_data && (
        <VideoEditModal
          is_open={is_edit_modal_open}
          video_data={selected_video_data}
          dark_mode={dark_mode}
          on_close={() => set_is_edit_modal_open(false)}
          on_save={(edited_data) => {
            console.log('Video edited:', edited_data);
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
      
      {/* 빈 상태일 때만 메시지 표시 */}
      {projects.length === 0 && render_empty_state()}
      {projects.map((project) => {
        const is_expanded = expanded_projects.has(project.id);
        const project_contents = all_contents[project.id] || [];
        
        console.log(`[렌더링] 프로젝트 "${project.title}" (ID: ${project.id}) 콘텐츠 개수: ${project_contents.length}`, project_contents);

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
                {/* 폴더 아이콘 */}
                {is_expanded ? (
                  <FolderOpen className="w-5 h-5 text-blue-500" />
                ) : (
                  <Folder className={`w-5 h-5 ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`} />
                )}

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
                  animate={{ rotate: is_expanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              </div>
            </Button>

            {/* 확장된 콘텐츠 영역 */}
            {is_expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`border-t ${dark_mode ? 'border-gray-700/50' : 'border-gray-300/50'} ${
                  dark_mode ? 'bg-gray-800/30' : 'bg-gray-50/30'
                }`}
              >
                {/* ContentTreeView 재활용 - 트리 테스트 모드 지원 */}
                <ContentTreeView
                  tree_data={is_tree_test_mode ? tree_test_data : null}
                  contents={!is_tree_test_mode ? project_contents : undefined}
                  dark_mode={dark_mode}
                  uploading_items={uploading_items}
                  on_preview={handle_preview}
                  on_publish={handle_publish}
                />
              </motion.div>
            )}
          </Card>
        );
      })}

      {/* 모든 모달들 */}
      {render_modals()}
    </div>
  );
}

export default React.memo(ProjectHistoryContainer);