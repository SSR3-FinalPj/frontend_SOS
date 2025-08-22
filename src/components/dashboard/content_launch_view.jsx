/**
 * ContentLaunchView 컴포넌트
 * .env 파일을 사용해 비디오 URL을 관리합니다.
 */

import React, { useState, useEffect } from 'react';
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
    toggle_folder,
    simulate_upload,
    fetch_folders
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
   * 게시 완료 핸들러
   */
  const handle_final_publish = async () => {
    if (!publish_modal.item) return;
    
    close_publish_modal();
    await simulate_upload(publish_modal.item.id);
    
    console.log('Published:', publish_form);
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
