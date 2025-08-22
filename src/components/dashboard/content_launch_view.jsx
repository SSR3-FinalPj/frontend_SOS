/**
 * ContentLaunchView 컴포넌트
 * .env 파일을 사용해 비디오 URL을 관리합니다.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import ContentFolderCard from './content_folder_card';
import ContentPreviewModal from './content_preview_modal';
import ContentPublishModal from './content_publish_modal';
import AIMediaRequestModal from './ai_media_request_modal.jsx';
import { Button } from '../ui/button.jsx';
import { use_content_launch } from '../../hooks/use_content_launch.jsx';
import { use_content_modals } from '../../hooks/use_content_modals.jsx';

/**
 * ContentLaunchView 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.dark_mode - 다크모드 여부
 * @returns {JSX.Element} ContentLaunchView 컴포넌트
 */
const ContentLaunchView = ({ dark_mode }) => {
  // AI 미디어 요청 모달 상태
  const [is_request_modal_open, set_is_request_modal_open] = useState(false);

  // 커스텀 훅 사용
  const {
    open_folders,
    uploading_items,
    folders,
    pending_videos,
    toggle_folder,
    simulate_upload,
    fetch_folders,
    transition_to_ready,
    transition_to_uploaded,
    add_pending_video
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

  /**
   * 웹소켓 완료 메시지 처리 함수
   * @param {string} video_id - 완료된 영상의 ID
   */
  const handle_completion = useCallback(async (video_id) => {
    try {
      // '생성 중' 영상을 '업로드 대기' 상태로 전환
      transition_to_ready(video_id);
      
      console.log(`영상 ${video_id} 업로드 대기 상태로 전환됨`);
    } catch (error) {
      console.error('완료 처리 중 오류:', error);
    }
  }, [transition_to_ready]);

  // TODO: 웹소켓 연동 시 주석 해제
  // const { connect, disconnect, is_connected } = use_websocket({
  //   url: 'ws://localhost:8080/video-completion',
  //   on_message: (message) => {
  //     const data = JSON.parse(message.data);
  //     
  //     switch (data.type) {
  //       case 'VIDEO_COMPLETED':
  //         if (data.video_id) {
  //           handle_completion(data.video_id);
  //         }
  //         break;
  //       
  //       case 'NEW_VIDEO_STARTED':
  //         if (data.video_data && data.video_id) {
  //           // 백엔드에서 새 영상 생성 시작 알림 (실제 video_id 포함)
  //           const creation_date = new Date().toISOString().split('T')[0];
  //           const video_with_id = {
  //             ...data.video_data,
  //             video_id: data.video_id, // 백엔드에서 제공한 실제 영상 ID
  //             temp_id: data.temp_id || data.video_data.temp_id // 기존 temp_id 유지
  //           };
  //           add_pending_video(video_with_id, creation_date);
  //           console.log('백엔드에서 새 영상 생성 시작:', video_with_id);
  //         }
  //         break;
  //       
  //       case 'VIDEO_ID_ASSIGNED':
  //         // 기존 temp_id를 가진 영상에 백엔드 video_id 할당
  //         if (data.temp_id && data.video_id) {
  //           use_content_launch.getState().update_video_id(data.temp_id, data.video_id);
  //           console.log(`영상 ID 업데이트: ${data.temp_id} → ${data.video_id}`);
  //         }
  //         break;
  //       
  //       default:
  //         console.log('알 수 없는 웹소켓 메시지:', data);
  //     }
  //   }
  // });
  
  // useEffect(() => {
  //   connect();
  //   return () => disconnect();
  // }, [connect, disconnect]);

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
    <div className={`flex-1 ${
      dark_mode 
        ? 'bg-gray-900' 
        : 'bg-transparent'
    } h-full overflow-hidden flex flex-col relative`}>
      

      {/* 날짜별 폴더 목록 */}
      <div className="flex-1 overflow-auto px-8 py-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* 통계 정보 및 CTA 버튼 */}
          <div className="flex items-center justify-between gap-4 mb-6">
            {/* AI 미디어 제작 요청 버튼 */}
            <Button
              onClick={() => set_is_request_modal_open(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg font-semibold rounded-2xl"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              새로운 미디어 제작 요청
            </Button>
            
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
                    onClick={async () => {
                      const first_pending_video = pending_videos.find(video => video.status === 'PROCESSING');
                      if (first_pending_video) {
                        // 첫 번째 영상만 '업로드 대기' 상태로 전환 및 다음 영상 자동 생성
                        await transition_to_ready(first_pending_video.temp_id);
                      }
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg"
                    size="sm"
                    title="영상을 완료 처리하고 다음 영상을 자동 생성합니다"
                  >
                    완료 처리 (자동생성)
                  </Button>
                  
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
      />
    </div>
  );
};

export default React.memo(ContentLaunchView);
