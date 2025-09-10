/**
 * ProjectHistoryContainer 컴포넌트
 * 프로젝트 히스토리 목록과 확장/축소 상태를 관리하는 컨테이너
 * FSD 컨테이너 패턴: 데이터 변환, 상태 관리, 비즈니스 로직 담당
 */

import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import ContentTreeView from '@/features/content-tree/ui/ContentTreeView';
import GeneratedVideoPreviewModal from '@/features/content-modals/ui/GeneratedVideoPreviewModal';
import ContentPublishModal from '@/features/content-modals/ui/ContentPublishModal';
import AIMediaRequestModal from '@/features/ai-media-request/ui/AiMediaRequestModal';
import VideoEditModal from '@/features/video-edit/ui/VideoEditModal';
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
    simulate_upload
  } = use_content_launch();

  // 모달 상태 관리
  const {
    is_preview_modal_open,
    is_publish_modal_open,
    selected_item_for_modal,
    open_preview_modal,
    close_preview_modal,
    open_publish_modal,
    close_publish_modal
  } = use_content_modals();

  // 추가 모달 상태
  const [is_request_modal_open, set_is_request_modal_open] = useState(false);
  const [is_edit_modal_open, set_is_edit_modal_open] = useState(false);
  const [publish_form, set_publish_form] = useState({
    platforms: [],
    title: '',
    description: '',
    tags: '',
    privacyStatus: 'private',
    categoryId: '22',
    madeForKids: false,
    subreddit: ''
  });

  // 프로젝트 확장/축소 상태 관리
  const [expanded_projects, set_expanded_projects] = useState(new Set());

  /**
   * 기존 folders 데이터를 projects 구조로 변환
   */
  const convert_to_projects = () => {
    return folders.map(folder => ({
      id: folder.id,
      title: folder.name,
      description: `${folder.videos?.length || 0}개의 영상이 포함된 프로젝트`,
      category: 'social',
      source_type: 'prompt',
      content_count: folder.videos?.length || 0,
      live_count: folder.videos?.filter(v => v.status === 'completed').length || 0,
      last_activity: '최근 활동'
    }));
  };

  /**
   * 기존 videos 데이터를 contents 구조로 변환
   */
  const convert_to_contents = () => {
    const all_contents = {};
    
    folders.forEach(folder => {
      all_contents[folder.id] = (folder.videos || []).map(video => ({
        id: video.id || video.resultId,
        title: video.title || '제목 없음',
        type: 'video',
        version: '1.0',
        parentId: null,
        isLive: video.status === 'completed',
        thumbnail: video.thumbnail || '',
        createdAt: video.creation_date || new Date().toISOString(),
        prompt: video.prompt || '',
        feedback: video.feedback || '',
        resultId: video.resultId,
        status: video.status
      }));
    });

    return all_contents;
  };

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
    set_publish_form(prev => ({
      ...prev,
      title: item.title || ''
    }));
    open_publish_modal(item);
  };

  /**
   * 폼 업데이트 핸들러
   */
  const handle_form_update = (field, value) => {
    set_publish_form(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * 플랫폼 토글 핸들러
   */
  const handle_platform_toggle = (platform) => {
    set_publish_form(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  // 프로젝트가 없을 때 빈 상태 표시
  if (projects.length === 0) {
    return (
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
  }

  return (
    <div className="space-y-4">
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
                {/* ContentTreeView 재활용 */}
                <ContentTreeView
                  contents={project_contents}
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
      {is_preview_modal_open && selected_item_for_modal && (
        <GeneratedVideoPreviewModal
          is_open={is_preview_modal_open}
          item={selected_item_for_modal}
          dark_mode={dark_mode}
          on_close={close_preview_modal}
          mode="launch"
          on_edit={(item) => {
            close_preview_modal();
            set_is_edit_modal_open(true);
          }}
        />
      )}

      {is_publish_modal_open && selected_item_for_modal && (
        <ContentPublishModal
          is_open={is_publish_modal_open}
          item={selected_item_for_modal}
          publish_form={publish_form}
          dark_mode={dark_mode}
          on_close={close_publish_modal}
          on_publish={(platforms, form) => {
            console.log('Publishing to platforms:', platforms, form);
            close_publish_modal();
          }}
          on_toggle_platform={handle_platform_toggle}
          on_update_form={handle_form_update}
        />
      )}

      {is_edit_modal_open && selected_item_for_modal && (
        <VideoEditModal
          is_open={is_edit_modal_open}
          video_data={selected_item_for_modal}
          dark_mode={dark_mode}
          on_close={() => set_is_edit_modal_open(false)}
          on_save={(edited_data) => {
            console.log('Video edited:', edited_data);
            set_is_edit_modal_open(false);
          }}
        />
      )}

      {is_request_modal_open && (
        <AIMediaRequestModal
          is_open={is_request_modal_open}
          on_close={() => set_is_request_modal_open(false)}
          dark_mode={dark_mode}
        />
      )}
    </div>
  );
}

export default React.memo(ProjectHistoryContainer);