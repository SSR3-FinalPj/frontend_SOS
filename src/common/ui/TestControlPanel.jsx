/**
 * 간소화된 테스트 컨트롤 패널
 * 핵심 기능 5가지만 제공: 생성, 미리보기, 수정, 업로드, 자식노드 생성
 */

import React, { useState, useRef, useEffect } from 'react';
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
  Play,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { use_content_launch } from '@/features/content-management/logic/use-content-launch';
import { use_content_modals } from '@/features/content-modals/logic/use-content-modals';
import { generateReactKey } from '@/common/utils/unique-id';
import { requestVideoStream, reviseVideo, uploadToYoutube, uploadToReddit } from '@/common/api/video-api-wrapper';

const TestControlPanel = ({ dark_mode = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // S3 직접 테스트용 상태
  const [directTestResultId, setDirectTestResultId] = useState('');
  const [directTestPrompt, setDirectTestPrompt] = useState('');
  const [directTestPlatform, setDirectTestPlatform] = useState('youtube');
  const [directTestResults, setDirectTestResults] = useState(null);
  const [isDirectTesting, setIsDirectTesting] = useState(false);

  // 외부 클릭 감지를 위한 ref
  const panelRef = useRef(null);

  // 외부 클릭 시 패널 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isVisible]);

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

  // S3 직접 테스트 함수들
  const handleDirectPreview = async () => {
    if (!directTestResultId.trim()) {
      alert('resultId를 입력해주세요.');
      return;
    }

    setIsDirectTesting(true);
    setDirectTestResults(null);

    try {
      const result = await requestVideoStream(parseInt(directTestResultId));
      setDirectTestResults({
        type: 'preview',
        success: true,
        data: result,
        message: '미리보기 URL을 성공적으로 가져왔습니다.'
      });

      // 스트리밍 URL이 있으면 새 창에서 열기
      if (result?.streamUrl || result?.url) {
        const streamUrl = result.streamUrl || result.url;
        window.open(streamUrl, '_blank');
      }
    } catch (error) {
      setDirectTestResults({
        type: 'preview',
        success: false,
        error: error.message,
        message: '미리보기를 가져오는데 실패했습니다.'
      });
    } finally {
      setIsDirectTesting(false);
    }
  };

  const handleDirectEdit = async () => {
    if (!directTestResultId.trim()) {
      alert('resultId를 입력해주세요.');
      return;
    }
    if (!directTestPrompt.trim()) {
      alert('수정할 프롬프트를 입력해주세요.');
      return;
    }

    setIsDirectTesting(true);
    setDirectTestResults(null);

    try {
      const result = await reviseVideo(parseInt(directTestResultId), directTestPrompt.trim());
      setDirectTestResults({
        type: 'edit',
        success: true,
        data: result,
        message: '영상 수정 요청이 성공적으로 전송되었습니다.'
      });
    } catch (error) {
      setDirectTestResults({
        type: 'edit',
        success: false,
        error: error.message,
        message: '영상 수정 요청에 실패했습니다.'
      });
    } finally {
      setIsDirectTesting(false);
    }
  };

  const handleDirectUpload = async () => {
    if (!directTestResultId.trim()) {
      alert('resultId를 입력해주세요.');
      return;
    }

    setIsDirectTesting(true);
    setDirectTestResults(null);

    try {
      const result = directTestPlatform === 'youtube'
        ? await uploadToYoutube(parseInt(directTestResultId))
        : await uploadToReddit(parseInt(directTestResultId));

      setDirectTestResults({
        type: 'upload',
        success: true,
        data: result,
        message: `${directTestPlatform.toUpperCase()} 업로드가 성공적으로 시작되었습니다.`
      });
    } catch (error) {
      setDirectTestResults({
        type: 'upload',
        success: false,
        error: error.message,
        message: `${directTestPlatform.toUpperCase()} 업로드에 실패했습니다.`
      });
    } finally {
      setIsDirectTesting(false);
    }
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
    <div ref={panelRef} className="fixed bottom-4 right-4 z-50 w-80 max-h-[80vh]">
      <Card className={`${dark_mode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-xl flex flex-col max-h-full`}>
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

        <CardContent className="space-y-4 overflow-y-auto flex-1">
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

          {/* S3 영상 직접 테스트 섹션 */}
          <div className={`space-y-3 border-t pt-4 ${dark_mode ? 'border-gray-600' : 'border-gray-200'}`}>
            <h4 className={`text-xs font-semibold ${dark_mode ? 'text-gray-300' : 'text-gray-600'}`}>
              S3 영상 직접 테스트
            </h4>

            {/* resultId 입력 */}
            <div>
              <label className={`text-xs font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-600'}`}>
                Result ID
              </label>
              <input
                type="number"
                placeholder="resultId 입력 (예: 1, 2, 3...)"
                value={directTestResultId}
                onChange={(e) => setDirectTestResultId(e.target.value)}
                className={`w-full mt-1 px-2 py-1 text-xs rounded border ${
                  dark_mode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
            </div>

            {/* 프롬프트 입력 (수정용) */}
            <div>
              <label className={`text-xs font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-600'}`}>
                수정 프롬프트 (수정 테스트용)
              </label>
              <textarea
                placeholder="수정할 프롬프트를 입력하세요..."
                value={directTestPrompt}
                onChange={(e) => setDirectTestPrompt(e.target.value)}
                rows={2}
                className={`w-full mt-1 px-2 py-1 text-xs rounded border resize-none ${
                  dark_mode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
            </div>

            {/* 플랫폼 선택 (업로드용) */}
            <div>
              <label className={`text-xs font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-600'}`}>
                업로드 플랫폼
              </label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={directTestPlatform === 'youtube' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDirectTestPlatform('youtube')}
                  className="flex-1 text-xs"
                >
                  YouTube
                </Button>
                <Button
                  variant={directTestPlatform === 'reddit' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDirectTestPlatform('reddit')}
                  className="flex-1 text-xs"
                >
                  Reddit
                </Button>
              </div>
            </div>

            {/* 테스트 버튼들 */}
            <div className="space-y-2">
              <Button
                onClick={handleDirectPreview}
                variant="outline"
                className="w-full"
                size="sm"
                disabled={!directTestResultId.trim() || isDirectTesting}
              >
                {isDirectTesting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                미리보기 테스트
              </Button>

              <Button
                onClick={handleDirectEdit}
                variant="outline"
                className="w-full"
                size="sm"
                disabled={!directTestResultId.trim() || !directTestPrompt.trim() || isDirectTesting}
              >
                {isDirectTesting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Edit className="w-4 h-4 mr-2" />
                )}
                수정 테스트
              </Button>

              <Button
                onClick={handleDirectUpload}
                variant="outline"
                className="w-full"
                size="sm"
                disabled={!directTestResultId.trim() || isDirectTesting}
              >
                {isDirectTesting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                업로드 테스트 ({directTestPlatform})
              </Button>
            </div>

            {/* 테스트 결과 표시 */}
            {directTestResults && (
              <div className={`text-xs p-2 rounded border ${
                directTestResults.success
                  ? dark_mode
                    ? 'bg-green-900 border-green-600 text-green-200'
                    : 'bg-green-50 border-green-300 text-green-800'
                  : dark_mode
                    ? 'bg-red-900 border-red-600 text-red-200'
                    : 'bg-red-50 border-red-300 text-red-800'
              }`}>
                <div className="font-medium flex items-center gap-2">
                  {directTestResults.success ? '✅' : '❌'} {directTestResults.message}
                  {directTestResults.success && directTestResults.type === 'preview' && directTestResults.data?.streamUrl && (
                    <ExternalLink className="w-3 h-3" />
                  )}
                </div>
                {directTestResults.success && directTestResults.data && (
                  <div className={`mt-1 ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(directTestResults.data, null, 2)}
                    </pre>
                  </div>
                )}
                {!directTestResults.success && directTestResults.error && (
                  <div className={`mt-1 ${dark_mode ? 'text-red-300' : 'text-red-600'}`}>
                    에러: {directTestResults.error}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestControlPanel;