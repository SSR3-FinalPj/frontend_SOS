/**
 * ProjectHistoryContainer 컴포넌트
 * 프로젝트 히스토리 목록과 확장/축소 상태를 관리하는 컨테이너
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/common/ui/card';
import { Button } from '@/common/ui/button';
import { Badge } from '@/common/ui/badge';
import { ChevronRight, FolderOpen, Folder, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import GeneratedVideoPreviewModal from '@/features/content-modals/ui/GeneratedVideoPreviewModal';
import ContentPublishModal from '@/features/content-modals/ui/ContentPublishModal';
import AIMediaRequestModal from '@/features/ai-media-request/ui/AiMediaRequestModal';
import { use_content_launch } from '@/features/content-management/logic/use-content-launch';
import { use_content_modals } from '@/features/content-modals/logic/use-content-modals';
import { LOCATION_DATA, get_location_by_poi_id } from '@/common/constants/location-data';
import VersionNavigationSystem from '@/features/version-navigation/ui/VersionNavigationSystem';
import { convertToTreeData } from '@/features/content-tree/logic/tree-utils';
import SuccessModal from '@/common/ui/success-modal';
import VideoEditModal from '@/features/video-edit/ui/VideoEditModal';

// Helper function to get project name from a synthetic project ID
function getProjectName(poiId) {
  if (typeof poiId === 'string' && poiId.startsWith('project_')) {
    const parts = poiId.split('_');
    const projectId = parts[1];
    const regionCode = parts[2];
    
    if (regionCode) {
      const location = get_location_by_poi_id(regionCode);
      if (location) {
        return `${location.name} # ${projectId}`;
      }
    }
    return `Project #${projectId}`;
  }
  return '기타 프로젝트';
}

function ProjectHistoryContainer({ dark_mode = false }) {
  const {
    folders,
    pending_videos,
    uploading_items,
    fetch_folders,
    handle_multi_platform_publish,
  } = use_content_launch();

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

  const [is_request_modal_open, set_is_request_modal_open] = useState(false);
  const [is_publishing, set_is_publishing] = useState(false);
  const [expanded_projects, set_expanded_projects] = useState(new Set());
  const [is_request_success_modal_open, set_is_request_success_modal_open] = useState(false);
  const [is_edit_modal_open, set_is_edit_modal_open] = useState(false);
  const [edit_target_video, set_edit_target_video] = useState(null);

  useEffect(() => {
    fetch_folders();
  }, []);

  const projects = React.useMemo(() => {
    const all_videos = [];
    folders.forEach(folder => {
      if (folder.items && folder.items.length > 0) {
        folder.items.forEach(item => all_videos.push(item));
      }
    });
    
    const groups = {};
    all_videos.forEach(video => {
      const projectId = video.poi_id;
      if (!projectId) return;
      if (!groups[projectId]) {
        groups[projectId] = [];
      }
      groups[projectId].push(video);
    });

    return Object.entries(groups).map(([projectId, videos]) => ({
      id: projectId,
      title: getProjectName(projectId),
      description: `${videos.length}개의 영상이 포함된 프로젝트`,
      content_count: videos.length,
      videos: videos,
    }));
  }, [folders]);

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

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 mb-6">
        <Button onClick={() => set_is_request_modal_open(true)} variant="brand" size="lg">
          <Plus className="w-5 h-5 mr-2" />
          새로운 미디어 제작 요청
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">프로젝트가 없습니다.</div>
      ) : (
        projects.map((project) => {
          const is_expanded = expanded_projects.has(project.id);
          
          // `convertToTreeData`를 사용하여 영상 목록을 트리 구조로 변환합니다.
          // 이 함수는 parent_id를 기반으로 계층 구조를 만듭니다.
          const projectTree = convertToTreeData(project.videos);

          return (
            <Card key={project.id} className={`overflow-hidden`}>
              <Button
                variant="ghost"
                className="w-full p-4 h-auto justify-between"
                onClick={() => handle_toggle_project(project.id)}
              >
                <div className="flex items-center gap-4">
                  <FolderOpen className="w-6 h-6 text-blue-500" />
                  <div>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-sm text-gray-500">{project.description}</div>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform ${is_expanded ? 'rotate-90' : ''}`} />
              </Button>

              {is_expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t"
                >
                  <div className="p-4">
                    <VersionNavigationSystem
                      treeData={projectTree} // 올바르게 생성된 트리 데이터를 전달합니다.
                      contents={project.videos} // 상세 정보를 위해 원본 배열도 전달합니다.
                      darkMode={dark_mode}
                      uploadingItems={uploading_items}
                      onPreview={open_preview_modal}
                      onPublish={open_publish_modal}
                      onEdit={(item) => {
                        set_edit_target_video(item);
                        set_is_edit_modal_open(true);
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </Card>
          );
        })
      )}

      {/* Modals */}
      {preview_modal.open && preview_modal.item && (
        <GeneratedVideoPreviewModal
          is_open={preview_modal.open}
          item={preview_modal.item}
          dark_mode={dark_mode}
          on_close={close_preview_modal}
          mode="launch"
          on_edit={(item) => {
            // 미리보기에서 수정하기
            set_edit_target_video(item);
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
      {/* 영상 수정 모달 */}
      <VideoEditModal
        is_open={is_edit_modal_open}
        on_close={() => {
          set_is_edit_modal_open(false);
          set_edit_target_video(null);
        }}
        selected_video={edit_target_video}
        dark_mode={dark_mode}
      />
      <AIMediaRequestModal
        is_open={is_request_modal_open}
        on_close={() => set_is_request_modal_open(false)}
        on_request_success={(data) => {
          // 폴더 갱신 후 성공 모달 표시
          fetch_folders();
          set_is_request_modal_open(false);
          set_is_request_success_modal_open(true);
        }}
        dark_mode={dark_mode}
      />

      {/* 영상 생성 요청 성공 모달 */}
      <SuccessModal
        is_open={is_request_success_modal_open}
        on_close={() => set_is_request_success_modal_open(false)}
        title="요청 완료"
        message="AI 미디어 제작 요청이 성공적으로 전송되었습니다!"
      />
    </div>
  );
}

export default React.memo(ProjectHistoryContainer);
