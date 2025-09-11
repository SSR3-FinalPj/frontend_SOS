/**
 * 간소화된 테스트 컨트롤 패널
 * 핵심 기능 5가지만 제공: 생성, 미리보기, 수정, 업로드, 자식노드 생성
 */

import React, { useState } from 'react';
import { Button } from '@/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/ui/card';
import { Badge } from '@/common/ui/badge';
import { 
  Plus,
  Eye, 
  Edit,
  Upload,
  GitBranch,
  TestTube,
  ChevronDown,
  Play
} from 'lucide-react';
import { use_content_launch } from '@/features/content-management/logic/use-content-launch';
import { use_content_modals } from '@/features/content-modals/logic/use-content-modals';
import { generateReactKey } from '@/common/utils/unique-id';

const TestControlPanel = ({ dark_mode = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  const {
    pending_videos,
    folders,
    simulate_upload,
    select_video
  } = use_content_launch();

  const {
    open_preview_modal
  } = use_content_modals();


  // 모든 영상 목록 (테스트용) - ProjectHistoryContainer와 동일한 로직 사용
  const allVideos = React.useMemo(() => {
    const all_videos = [];
    
    // 1. folders에서 영상 데이터 수집
    folders.forEach(folder => {
      if (folder.items && folder.items.length > 0) {
        all_videos.push(...folder.items);
      }
    });
    
    // 2. pending_videos에서 추가 영상 데이터 수집 (중복 제거)
    pending_videos.forEach(video => {
      const isDuplicate = all_videos.some(existingVideo => {
        return (existingVideo.id === video.id) ||
               (existingVideo.temp_id === video.temp_id) ||
               (existingVideo.resultId === video.resultId);
      });
      
      if (!isDuplicate) {
        all_videos.push(video);
      }
    });
    
    return all_videos;
  }, [folders, pending_videos]);

  // 1. 영상 생성
  const handleCreateVideo = () => {
    const testEvent = new CustomEvent('test-open-ai-media-modal', {
      detail: { 
        testMode: true, 
        platform: selectedPlatform,
        autoFill: true,
        autoSubmit: false
      }
    });
    window.dispatchEvent(testEvent);
  };

  // 2. 미리보기
  const handlePreview = () => {
    if (!selectedVideo) {
      alert('미리보기할 영상을 선택해주세요.');
      return;
    }
    open_preview_modal(selectedVideo);
  };

  // 3. 수정
  const handleEdit = () => {
    if (!selectedVideo) {
      alert('수정할 영상을 선택해주세요.');
      return;
    }
    
    // 영상 선택 후 수정 모달 열기
    select_video(selectedVideo.id || selectedVideo.result_id || selectedVideo.temp_id);
    
    const testEvent = new CustomEvent('test-open-video-edit-modal', {
      detail: { 
        testMode: true, 
        selectedVideo: selectedVideo
      }
    });
    window.dispatchEvent(testEvent);
  };

  // 4. 업로드
  const handleUpload = () => {
    if (!selectedVideo) {
      alert('업로드할 영상을 선택해주세요.');
      return;
    }
    
    simulate_upload(selectedVideo.id || selectedVideo.result_id || selectedVideo.temp_id);
    alert(`${selectedVideo.title} 업로드를 시작했습니다.`);
  };

  // 5. 자식 노드 생성 (버전 트리용)
  const handleCreateChildVersion = () => {
    if (!selectedVideo) {
      alert('부모 영상을 선택해주세요.');
      return;
    }

    // 간단한 트리 구조 데이터 생성
    const parentId = selectedVideo.result_id || selectedVideo.id || Date.now();
    const childId = parentId + 1;
    
    const treeData = [
      {
        result_id: parentId,
        title: selectedVideo.title || `테스트 영상 (부모)`,
        platform: selectedVideo.platform || selectedPlatform,
        status: 'ready',
        version: '1.0',
        created_at: new Date().toISOString(),
        children: [
          {
            result_id: childId,
            title: `${selectedVideo.title || '테스트 영상'} - 수정본`,
            platform: selectedVideo.platform || selectedPlatform,
            status: 'ready', 
            version: '1.1',
            created_at: new Date().toISOString(),
            children: []
          }
        ]
      }
    ];

    // 트리 구조 테스트 이벤트 발생
    const testEvent = new CustomEvent('test-tree-structure', {
      detail: { 
        tree_data: treeData,
        type: 'parent-child',
        message: '부모-자식 버전 관계 생성됨'
      }
    });
    window.dispatchEvent(testEvent);
    
    alert('자식 버전이 생성되었습니다. 버전 네비게이션에서 확인해보세요!');
  };

  // 영상 선택 핸들러
  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        >
          <TestTube className="w-4 h-4 mr-2" />
          테스트 패널
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className={`${dark_mode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-xl`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className={`text-sm font-semibold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
              <TestTube className="w-4 h-4 mr-2 inline" />
              테스트 패널
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className={dark_mode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 플랫폼 선택 */}
          <div>
            <label className={`text-xs font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-600'}`}>
              플랫폼 선택
            </label>
            <div className="flex gap-2 mt-1">
              <Button
                variant={selectedPlatform === 'youtube' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPlatform('youtube')}
                className="flex-1"
              >
                YouTube
              </Button>
              <Button
                variant={selectedPlatform === 'reddit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPlatform('reddit')}
                className="flex-1"
              >
                Reddit
              </Button>
            </div>
          </div>

          {/* 영상 선택 */}
          <div>
            <label className={`text-xs font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-600'}`}>
              영상 선택 ({allVideos.length}개)
            </label>
            <div className="max-h-32 overflow-y-auto mt-1 space-y-1">
              {allVideos.length === 0 ? (
                <div className={`text-xs ${dark_mode ? 'text-gray-500' : 'text-gray-400'}`}>
                  영상이 없습니다. 먼저 영상을 생성해주세요.
                </div>
              ) : (
                allVideos.slice(0, 5).map((video, index) => {
                  const baseKey = video.id || video.result_id || video.temp_id;
                  const uniqueKey = generateReactKey(baseKey, 'video', index);
                  
                  return (
                    <div
                      key={uniqueKey}
                      onClick={() => handleVideoSelect(video)}
                      className={`p-2 rounded text-xs cursor-pointer border ${
                        selectedVideo === video
                          ? dark_mode 
                            ? 'bg-blue-900 border-blue-600 text-blue-200' 
                            : 'bg-blue-50 border-blue-300 text-blue-800'
                          : dark_mode
                            ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                    <div className="font-medium truncate">
                      {video.title || '제목 없음'}
                    </div>
                    <div className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {video.platform || selectedPlatform} • {video.status || 'unknown'}
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 핵심 기능 버튼들 */}
          <div className="space-y-2">
            <h4 className={`text-xs font-semibold ${dark_mode ? 'text-gray-300' : 'text-gray-600'}`}>
              핵심 기능 테스트
            </h4>

            {/* 1. 영상 생성 */}
            <Button
              onClick={handleCreateVideo}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              1. 영상 생성
            </Button>

            {/* 2. 미리보기 */}
            <Button
              onClick={handlePreview}
              variant="outline"
              className="w-full"
              size="sm"
              disabled={!selectedVideo}
            >
              <Eye className="w-4 h-4 mr-2" />
              2. 미리보기
            </Button>

            {/* 3. 수정 */}
            <Button
              onClick={handleEdit}
              variant="outline"
              className="w-full"
              size="sm"
              disabled={!selectedVideo}
            >
              <Edit className="w-4 h-4 mr-2" />
              3. 수정
            </Button>

            {/* 4. 업로드 */}
            <Button
              onClick={handleUpload}
              variant="outline"
              className="w-full"
              size="sm"
              disabled={!selectedVideo}
            >
              <Upload className="w-4 h-4 mr-2" />
              4. 업로드
            </Button>

            {/* 5. 자식 노드 생성 */}
            <Button
              onClick={handleCreateChildVersion}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
              disabled={!selectedVideo}
            >
              <GitBranch className="w-4 h-4 mr-2" />
              5. 자식 버전 생성
            </Button>
          </div>

          {/* 선택된 영상 정보 */}
          {selectedVideo && (
            <div className={`text-xs p-2 rounded ${dark_mode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className={`font-medium ${dark_mode ? 'text-gray-200' : 'text-gray-800'}`}>
                선택된 영상
              </div>
              <div className={`${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
                {selectedVideo.title || '제목 없음'}
              </div>
              <div className={`${dark_mode ? 'text-gray-500' : 'text-gray-500'}`}>
                ID: {selectedVideo.result_id || selectedVideo.id || selectedVideo.temp_id}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestControlPanel;