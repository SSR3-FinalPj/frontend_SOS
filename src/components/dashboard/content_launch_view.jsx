/**
 * ContentLaunchView 컴포넌트
 * .env 파일을 사용해 비디오 URL을 관리합니다.
 */

import React, { useState } from 'react';
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
    toggle_folder,
    simulate_upload
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

  // ▼▼▼▼▼ .env 파일에서 비디오 URL을 가져옵니다 ▼▼▼▼▼
  const testVideoUrl1 = import.meta.env.VITE_TEST_VIDEO_URL_1 || import.meta.env.VITE_FALLBACK_VIDEO_URL;


  // 날짜별로 그룹화된 AI 생성 콘텐츠 데이터 (환경 변수 사용)
  const date_folders = [
    {
      date: '2024-12-13',
      display_date: '2024년 12월 13일',
      item_count: 4,
      items: [
        {
          id: '1',
          title: 'AI 분석: 연말 파티 준비 완벽 가이드',
          type: 'video',
          platform: 'youtube',
          status: 'ready',
          engagement_score: 94,
          estimated_views: 15200,
          created_at: '09:15',
          description: '2024년을 마무리하는 완벽한 연말 파티를 위한 단계별 가이드입니다. 예산 계획부터 장소 선정, 음식 준비, 데코레이션까지 모든 것을 다룹니다.',
          video_url: testVideoUrl1 // 첫 번째 테스트 비디오
        },
        {
          id: '2',
          title: '2024년 트렌드 총정리: 무엇이 바뀌었나?',
          type: 'text',
          platform: 'reddit',
          status: 'ready',
          engagement_score: 87,
          estimated_views: 3400,
          created_at: '11:30',
          description: '올해 가장 주목받은 기술, 문화, 사회적 트렌드들을 분석하고 2025년 전망을 제시합니다.'
        },
        {
          id: '4',
          title: '효과적인 썸네일 제작 방법론',
          type: 'video',
          platform: 'youtube',
          status: 'uploaded',
          engagement_score: 89,
          estimated_views: 12100,
          created_at: '16:45',
          description: '클릭률을 높이는 썸네일 디자인의 핵심 원리와 실전 팁을 공개합니다.',
          video_url: testVideoUrl1 // 두 번째 테스트 비디오
        },
        {
          id: '5',
          title: '브랜딩 전략: 색상 심리학 활용법',
          type: 'text',
          platform: 'reddit',
          status: 'ready',
          engagement_score: 85,
          estimated_views: 2800,
          created_at: '18:10',
          description: '브랜드 아이덴티티 구축에서 색상이 미치는 심리적 영향과 전략적 활용 방법을 분석합니다.'
        }
      ]
    },
    {
      date: '2024-12-12',
      display_date: '2024년 12월 12일',
      item_count: 2,
      items: [
        {
          id: '6',
          title: '소셜미디어 최적화 전략 영상',
          type: 'video',
          platform: 'youtube',
          status: 'ready',
          engagement_score: 92,
          estimated_views: 18500,
          created_at: '10:30',
          description: '각 플랫폼별 알고리즘 특성을 이해하고 콘텐츠 최적화하는 방법을 설명합니다.',
          video_url: testVideoUrl1 // 세 번째 테스트 비디오
        },
        {
          id: '7',
          title: '커뮤니티 참여도 높이는 방법',
          type: 'text',
          platform: 'reddit',
          status: 'ready',
          engagement_score: 88,
          estimated_views: 4200,
          created_at: '15:20',
          description: '온라인 커뮤니티에서 의미있는 토론을 이끌어내고 참여도를 높이는 전략을 공유합니다.'
        },
      ]
    }
  ];

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
                  {date_folders.reduce((sum, folder) => sum + folder.item_count, 0)}
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
                    {date_folders.length}
                  </div>
                  <div className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>폴더</div>
                </div>
              </div>
            </div>
          </div>

          {/* 폴더 카드들 */}
          {date_folders.map((folder) => (
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
