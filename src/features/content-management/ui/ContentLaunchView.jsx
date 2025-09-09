/**
 * ContentLaunchView 컴포넌트
 * .env 파일을 사용해 비디오 URL을 관리합니다.
 */

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Plus, RefreshCw, TestTube, Code } from 'lucide-react';
import ContentFolderCard from '@/features/content-management/ui/ContentFolderCard';
import GeneratedVideoPreviewModal from '@/features/content-modals/ui/GeneratedVideoPreviewModal';
import ContentPublishModal from '@/features/content-modals/ui/ContentPublishModal';
import AIMediaRequestModal from '@/features/ai-media-request/ui/AiMediaRequestModal';
import { Button } from '@/common/ui/button';
import { use_content_launch } from '@/features/content-management/logic/use-content-launch';
import { use_content_modals } from '@/features/content-modals/logic/use-content-modals';
import ConfirmationModal from '@/common/ui/confirmation-modal';
import SuccessModal from '@/common/ui/success-modal';

/**
 * ContentLaunchView 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.dark_mode - 다크모드 여부
 * @returns {JSX.Element} ContentLaunchView 컴포넌트
 */
const ContentLaunchView = forwardRef(({ dark_mode }, ref) => {
  // AI 미디어 요청 모달 상태
  const [is_request_modal_open, set_is_request_modal_open] = useState(false);
  
  // 우선순위 확인 모달 상태
  const [is_priority_confirm_modal_open, set_is_priority_confirm_modal_open] = useState(false);
  const [is_priority_mode, set_is_priority_mode] = useState(false);
  
  // 성공 모달 및 예약 비디오 데이터 상태
  const [is_success_modal_open, set_is_success_modal_open] = useState(false);
  const [pending_video_data, set_pending_video_data] = useState(null);

  // 커스텀 훅 사용
  const {
    open_folders,
    uploading_items,
    folders,
    pending_videos,
    selected_video_id,
    selected_video_data,
    toggle_folder,
    simulate_upload,
    fetch_folders,
    transition_to_uploaded,
    add_pending_video,
    replace_processing_video,
    select_video,
    handle_multi_platform_publish
  } = use_content_launch();

  const {
    preview_modal,
    publish_modal,
    publish_form,
    open_preview_modal,
    close_preview_modal,
    open_publish_modal,
    close_publish_modal,
    toggle_platform,
    update_publish_form
  } = use_content_modals();

  // 컴포넌트 마운트 시 폴더 데이터 로딩
  useEffect(() => {
    fetch_folders();
  }, [fetch_folders]);

  // ref를 통해 외부에서 접근 가능한 함수들을 노출
  useImperativeHandle(ref, () => ({
    handle_open_upload_test_modal
  }));

  // 요청 성공 핸들러 (낙관적 UI 패턴 적용)
  const handleRequestSuccess = (requestData) => {
    // 기존 로직: 성공 모달 및 펜딩 비디오 데이터 설정
    set_pending_video_data(requestData);
    set_is_success_modal_open(true);
    
    // 🚀 낙관적 UI: AI 미디어 요청 모달을 즉시 닫기
    set_is_request_modal_open(false);
  };
  
  // 성공 모달 닫기 핸들러 - 실제 비디오 카드 추가
  const handleSuccessModalClose = () => {
    if (pending_video_data) {
      const { video_data, creation_date, isPriority } = pending_video_data;
      
      if (isPriority) {
        replace_processing_video(video_data, creation_date);
      } else {
        add_pending_video(video_data, creation_date);
      }
      
      set_pending_video_data(null);
    }
    set_is_success_modal_open(false);
  };

  /**
   * YouTube 업로드 테스트 모달 열기 핸들러
   */
  const handle_open_upload_test_modal = (resultId) => {
    // 가상의 mockItem 객체 생성
    const mockItem = {
      result_id: resultId,
      title: `[테스트] Result ${resultId}의 영상`,
      description: `Result ID: ${resultId}에 대한 업로드 테스트입니다.`,
      platform: 'youtube',
      video_id: `test-video-${Date.now()}`,
      temp_id: `temp-${Date.now()}`,
      status: 'COMPLETED',
      created_at: new Date().toISOString(),
      thumbnail: '/placeholder-thumbnail.jpg' // 플레이스홀더 썸네일
    };
    
    // 기존 게시 모달 열기 함수 사용
    open_publish_modal(mockItem);
  };

  /**
   * 게시 완료 핸들러 (FSD 아키텍처 준수)
   */
  const handle_final_publish = async () => {
    if (!publish_modal.item || !publish_form) return;

    try {
      // Logic 레이어의 멀티 플랫폼 게시 액션 호출 (모든 비즈니스 로직은 스토어에서 처리)
      await handle_multi_platform_publish(publish_form, publish_modal.item);
    } catch (error) {
      // 에러는 이미 스토어에서 알림으로 처리됨
      console.error('게시 실패:', error);
    } finally {
      // UI는 오직 모달 닫기만 담당
      close_publish_modal();
    }
  };

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col relative">
      

      {/* 날짜별 폴더 목록 */}
      <div className="h-full overflow-auto relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* 통계 정보 및 CTA 버튼 */}
          <div className="flex items-start justify-between gap-4 mb-6">
            {/* 버튼 영역 */}
            <div className="flex items-start gap-4">
              {/* 새로운 미디어 제작 요청 버튼 */}
              <div className="flex flex-col">
                <Button
                  onClick={() => {
                    // 일반 영상 생성
                    set_is_priority_mode(false);
                    set_is_request_modal_open(true);
                  }}
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 text-gray-800 dark:text-white shadow-lg font-semibold rounded-2xl"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  새로운 미디어 제작 요청
                </Button>
                
                {/* 설명 텍스트 */}
                <p className={`text-xs mt-2 ${dark_mode ? 'text-blue-200/80' : 'text-blue-600/70'} font-medium max-w-xs`}>
                  AI로 새로운 영상을 생성합니다
                </p>
              </div>

              {/* 영상 수정 요청 버튼 (준비됨/완료 영상이 선택된 상태에서만 표시) */}
              {selected_video_data && (selected_video_data.status === 'ready' || selected_video_data.status === 'uploaded') && (
                <div className="flex flex-col">
                  <Button
                    onClick={() => {
                      // 수정 모드로 AI 미디어 요청 모달 열기
                      set_is_priority_mode(false);
                      set_is_request_modal_open(true);
                    }}
                    className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 hover:from-orange-500/30 hover:to-red-500/30 text-orange-600 dark:text-orange-300 shadow-lg font-semibold rounded-2xl"
                    size="lg"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
영상 수정하기
                  </Button>
                  
                  
                  {/* 설명 텍스트 */}
                  <p className={`text-xs mt-2 ${dark_mode ? 'text-orange-200/80' : 'text-orange-600/70'} font-medium max-w-xs`}>
                    "프롬프트만 입력하여 {selected_video_data.title}의 새로운 버전을 생성합니다"
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
                  <div className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>폴더</div>
                </div>
              </div>
              
              {/* 데이터 초기화 버튼 */}
              {pending_videos.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      // localStorage 데이터 초기화
                      localStorage.removeItem('content-launch-storage');
                      // 페이지 새로고침으로 상태 초기화
                      window.location.reload();
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg"
                    size="sm"
                  >
                    데이터 초기화
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* 폴더 카드들 */}
          {folders.map((folder) => (
            <ContentFolderCard
              key={folder.date}
              folder={folder}
              dark_mode={dark_mode}
              is_open={open_folders.includes(folder.date)}
              uploading_items={uploading_items}
              on_toggle={() => toggle_folder(folder.date)}
              on_preview={open_preview_modal}
              on_publish={open_publish_modal}
              selected_video_id={selected_video_id}
              on_video_select={select_video}
            />
          ))}
        </div>
      </div>

      {/* AI 생성 영상 미리보기 모달 */}
      <GeneratedVideoPreviewModal
        is_open={preview_modal.open}
        item={preview_modal.item}
        dark_mode={dark_mode}
        on_close={close_preview_modal}
        mode="launch"
        on_edit={(item) => {
          // 수정 모달 열기
          set_is_request_modal_open(true);
        }}
      />

      {/* 게시 모달 */}
      <ContentPublishModal
        is_open={publish_modal.open}
        item={publish_modal.item}
        publish_form={publish_form}

        dark_mode={dark_mode}
        on_close={close_publish_modal}
        on_publish={handle_final_publish}
        on_toggle_platform={toggle_platform}
        on_update_form={update_publish_form}
      />

      {/* AI 미디어 제작 요청 모달 */}
      <AIMediaRequestModal
        is_open={is_request_modal_open}
        on_close={() => set_is_request_modal_open(false)}
        isPriority={is_priority_mode}
        selectedVideoData={selected_video_data}
        on_request_success={handleRequestSuccess}
        isEditMode={selected_video_data && (selected_video_data.status === 'ready' || selected_video_data.status === 'uploaded')}
      />

      {/* 우선순위 재생성 확인 모달 */}
      <ConfirmationModal
        isOpen={is_priority_confirm_modal_open}
        onClose={() => set_is_priority_confirm_modal_open(false)}
        onConfirm={() => {
          // 확인 시 우선순위 모드로 AI 미디어 요청 모달 열기
          set_is_priority_mode(true);
          set_is_request_modal_open(true);
          set_is_priority_confirm_modal_open(false);
        }}
        title="영상 생성 작업 교체"
        message="현재 생성 중인 영상 생성이 중단되고 새롭게 생성을 시작합니다."
      />
      
      {/* 성공 모달 */}
      <SuccessModal
        is_open={is_success_modal_open}
        on_close={handleSuccessModalClose}
        message="AI 미디어 제작 요청이 성공적으로 전송되었습니다!"
        title="요청 완료"
      />
    </div>
  );
});

ContentLaunchView.displayName = 'ContentLaunchView';

export default React.memo(ContentLaunchView);
