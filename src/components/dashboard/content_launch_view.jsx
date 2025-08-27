/**
 * ContentLaunchView 컴포넌트
 * .env 파일을 사용해 비디오 URL을 관리합니다.
 */

import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import ContentFolderCard from './content_folder_card';
import ContentPreviewModal from './content_preview_modal';
import ContentPublishModal from './content_publish_modal';
import AIMediaRequestModal from './ai_media_request_modal.jsx';
import { Button } from '../ui/button.jsx';
import { use_content_launch } from '../../hooks/use_content_launch.jsx';
import { use_content_modals } from '../../hooks/use_content_modals.jsx';
import ConfirmationModal from '../ui/confirmation_modal.jsx';
import SuccessModal from '../ui/success_modal.jsx';

/**
 * ContentLaunchView 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.dark_mode - 다크모드 여부
 * @returns {JSX.Element} ContentLaunchView 컴포넌트
 */
const ContentLaunchView = ({ dark_mode }) => {
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
    select_video
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

  // 요청 성공 핸들러
  const handleRequestSuccess = (requestData) => {
    set_pending_video_data(requestData);
    set_is_success_modal_open(true);
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
   * 게시 완료 핸들러
   */
  const handle_final_publish = async () => {
    if (!publish_modal.item) return;
    
    // 백엔드 video_id 우선, 없으면 temp_id, 마지막으로 기존 id 사용
    const item_id = publish_modal.item.video_id || publish_modal.item.temp_id || publish_modal.item.id;
    
    console.log('게시 시작:', {
      item: publish_modal.item,
      final_item_id: item_id,
      publish_form
    });
    
    close_publish_modal();
    await simulate_upload(item_id);
    
    console.log('게시 완료:', publish_form);
  };

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col relative">
      

      {/* 날짜별 폴더 목록 */}
      <div className="h-full overflow-auto px-8 py-6 relative z-10">
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

              {/* 우선순위 재생성 요청 버튼 (PROCESSING 영상이 있을 때만 표시) */}
              {pending_videos.filter(video => video.status === 'PROCESSING').length > 0 && (
                <div className="flex flex-col">
                  <Button
                    onClick={() => {
                      set_is_priority_confirm_modal_open(true);
                    }}
                    className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 hover:from-orange-500/30 hover:to-red-500/30 text-orange-600 dark:text-orange-300 shadow-lg font-semibold rounded-2xl"
                    size="lg"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    {selected_video_data ? '선택한 영상으로 재생성' : '성공작으로 다시 만들기'}
                  </Button>
                  
                  
                  {/* 설명 텍스트 */}
                  <p className={`text-xs mt-2 ${dark_mode ? 'text-orange-200/80' : 'text-orange-600/70'} font-medium max-w-xs`}>
                    {selected_video_data 
                      ? `"${selected_video_data.title}"을(를) 기반으로 재생성합니다`
                      : '현재 생성 중인 작업을 중단하고 새로 시작합니다'
                    }
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
              
              {/* 테스트용 버튼들 */}
              {pending_videos.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const first_ready_video = pending_videos.find(video => video.status === 'ready');
                      if (first_ready_video) {
                        // 첫 번째 '업로드 대기' 영상을 '완료' 상태로 전환
                        transition_to_uploaded(first_ready_video.temp_id);
                      }
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-lg"
                    size="sm"
                  >
                    업로드 완료 처리
                  </Button>
                  
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

      {/* 미리보기 모달 */}
      <ContentPreviewModal
        is_open={preview_modal.open}
        item={preview_modal.item}
        dark_mode={dark_mode}
        on_close={close_preview_modal}
        on_publish={open_publish_modal}
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
};

export default React.memo(ContentLaunchView);
