/**
 * 🧪 TEST COMPONENT - 간소화된 테스트 컨트롤 패널
 * 핵심 기능 5가지만 제공: 생성, 미리보기, 수정, 업로드, 자식노드 생성
 * 
 * ⚠️ 주의: 이 컴포넌트는 테스트 목적으로만 사용됩니다.
 * 프로덕션 환경에서는 이 파일을 삭제해야 합니다.
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
import { generateReactKey, generateTempVideoId } from '@/common/utils/unique-id';
import { uploadToYoutube, uploadToReddit, requestVideoStream } from '@/common/api/video-api-wrapper';

// ResultId 직접 테스트 컴포넌트
const ResultIdTestSection = ({ dark_mode }) => {
  const [resultId, setResultId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  // 스트리밍 테스트
  const handleStreamTest = async () => {
    if (!resultId.trim()) {
      alert('resultId를 입력해주세요');
      return;
    }

    setIsLoading(true);
    try {
      const result = await requestVideoStream(resultId);
      setLastResult({ type: 'stream', result });
      console.log('✅ 스트리밍 테스트 성공:', result);
      alert(`스트리밍 성공! URL: ${result.videoUrl || '응답 확인 필요'}`);
    } catch (error) {
      console.error('❌ 스트리밍 테스트 실패:', error);
      alert(`스트리밍 실패: ${error.message}`);
      setLastResult({ type: 'stream', error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // YouTube 업로드 테스트
  const handleYoutubeUploadTest = async () => {
    if (!resultId.trim()) {
      alert('resultId를 입력해주세요');
      return;
    }

    setIsLoading(true);
    try {
      const result = await uploadToYoutube(resultId, {
        title: `테스트 영상 - ${new Date().toLocaleString()}`,
        description: '테스트 패널에서 업로드한 영상입니다.',
        tags: ['test', 'demo'],
        privacy: 'private'
      });
      setLastResult({ type: 'youtube', result });
      console.log('✅ YouTube 업로드 성공:', result);
      alert(`YouTube 업로드 성공! ${result.videoUrl || '업로드 완료'}`);
    } catch (error) {
      console.error('❌ YouTube 업로드 실패:', error);
      alert(`YouTube 업로드 실패: ${error.message}`);
      setLastResult({ type: 'youtube', error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Reddit 업로드 테스트
  const handleRedditUploadTest = async () => {
    if (!resultId.trim()) {
      alert('resultId를 입력해주세요');
      return;
    }

    setIsLoading(true);
    try {
      const result = await uploadToReddit(resultId, {
        subreddit: 'test',
        title: `테스트 게시물 - ${new Date().toLocaleString()}`
      });
      setLastResult({ type: 'reddit', result });
      console.log('✅ Reddit 업로드 성공:', result);
      alert(`Reddit 업로드 성공! ${result.postUrl || '업로드 완료'}`);
    } catch (error) {
      console.error('❌ Reddit 업로드 실패:', error);
      alert(`Reddit 업로드 실패: ${error.message}`);
      setLastResult({ type: 'reddit', error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2 mt-2">
      {/* resultId 입력 */}
      <div>
        <input
          type="number"
          value={resultId}
          onChange={(e) => setResultId(e.target.value)}
          placeholder="resultId 입력 (예: 1, 2, 3...)"
          className={`w-full px-2 py-1 text-xs rounded border ${
            dark_mode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
      </div>

      {/* 테스트 버튼들 */}
      <div className="grid grid-cols-3 gap-1">
        <Button
          onClick={handleStreamTest}
          disabled={isLoading || !resultId.trim()}
          size="sm"
          variant="outline"
          className="text-xs py-1"
        >
          <Play className="w-3 h-3 mr-1" />
          스트리밍
        </Button>
        
        <Button
          onClick={handleYoutubeUploadTest}
          disabled={isLoading || !resultId.trim()}
          size="sm"
          variant="outline"
          className="text-xs py-1"
        >
          <Upload className="w-3 h-3 mr-1" />
          YouTube
        </Button>
        
        <Button
          onClick={handleRedditUploadTest}
          disabled={isLoading || !resultId.trim()}
          size="sm"
          variant="outline"
          className="text-xs py-1"
        >
          <Upload className="w-3 h-3 mr-1" />
          Reddit
        </Button>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
          테스트 중...
        </div>
      )}

      {/* 마지막 결과 */}
      {lastResult && (
        <div className={`text-xs p-2 rounded border ${
          dark_mode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`font-medium ${lastResult.error ? 'text-red-500' : 'text-green-500'}`}>
            {lastResult.type.toUpperCase()} {lastResult.error ? '실패' : '성공'}
          </div>
          <div className={`${dark_mode ? 'text-gray-400' : 'text-gray-600'} break-all`}>
            {lastResult.error || (lastResult.result?.videoUrl || lastResult.result?.postUrl || '완료')}
          </div>
        </div>
      )}
    </div>
  );
};

// S3 영상 직접 추가 컴포넌트
const S3VideoAddSection = ({ dark_mode, selectedPlatform }) => {
  const [jobId, setJobId] = useState('12345');
  const [resultId, setResultId] = useState('12345');
  const [s3Key, setS3Key] = useState('video/req_f005f49d0750497eb0f78778066d1858.mp4');
  const [isAdding, setIsAdding] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const { add_pending_video } = use_content_launch();

  // S3 영상 추가 핸들러
  const handleAddS3Video = async () => {
    if (!jobId.trim() || !resultId.trim() || !s3Key.trim()) {
      alert('모든 필드를 입력해주세요');
      return;
    }

    setIsAdding(true);
    try {
      const s3VideoData = {
        temp_id: `s3_${resultId}`,
        result_id: Number(resultId),     // 12345
        job_id: Number(jobId),           // 12345  
        title: `S3 영상 (${resultId})`,
        status: 'ready',                 // 즉시 미리보기/업로드 가능
        platform: selectedPlatform,
        s3Key: s3Key,                    // S3 파일 경로
        resultKey: s3Key,                // 백엔드 API 호환 필드
        type: 'video',
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        // 추가 메타데이터
        poi_id: 'POI001', // 기본 위치
        location_id: 'POI001',
        location_name: '테스트 위치',
        user_request: 'S3에서 직접 추가된 영상'
      };
      
      const creation_date = new Date().toISOString().split('T')[0];
      add_pending_video(s3VideoData, creation_date);
      
      setLastResult({ type: 'add', success: true, data: s3VideoData });
      console.log('✅ S3 영상 추가 성공:', s3VideoData);
      alert(`S3 영상이 성공적으로 추가되었습니다! ID: ${resultId}`);
    } catch (error) {
      console.error('❌ S3 영상 추가 실패:', error);
      alert(`S3 영상 추가 실패: ${error.message}`);
      setLastResult({ type: 'add', error: error.message });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-2 mt-2">
      {/* 입력 필드들 */}
      <div className="grid grid-cols-1 gap-2">
        {/* Job ID */}
        <div>
          <label className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
            Job ID (숫자)
          </label>
          <input
            type="number"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            placeholder="12345"
            className={`w-full px-2 py-1 text-xs rounded border ${
              dark_mode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        {/* Result ID */}
        <div>
          <label className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
            Result ID (숫자)
          </label>
          <input
            type="number"
            value={resultId}
            onChange={(e) => setResultId(e.target.value)}
            placeholder="12345"
            className={`w-full px-2 py-1 text-xs rounded border ${
              dark_mode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        {/* S3 Key */}
        <div>
          <label className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
            S3 파일 경로
          </label>
          <input
            type="text"
            value={s3Key}
            onChange={(e) => setS3Key(e.target.value)}
            placeholder="videos/req_xxx.mp4"
            className={`w-full px-2 py-1 text-xs rounded border ${
              dark_mode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* 추가 버튼 */}
      <Button
        onClick={handleAddS3Video}
        disabled={isAdding || !jobId.trim() || !resultId.trim() || !s3Key.trim()}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        size="sm"
      >
        {isAdding ? (
          <>
            <div className="w-3 h-3 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            추가 중...
          </>
        ) : (
          <>
            <Plus className="w-3 h-3 mr-1" />
            S3 영상 추가
          </>
        )}
      </Button>

      {/* 로딩 상태 */}
      {isAdding && (
        <div className={`text-xs ${dark_mode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
          영상을 시스템에 추가하는 중...
        </div>
      )}

      {/* 마지막 결과 */}
      {lastResult && (
        <div className={`text-xs p-2 rounded border ${
          dark_mode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`font-medium ${lastResult.error ? 'text-red-500' : 'text-green-500'}`}>
            S3 영상 추가 {lastResult.error ? '실패' : '성공'}
          </div>
          <div className={`${dark_mode ? 'text-gray-400' : 'text-gray-600'} break-all`}>
            {lastResult.error || `ID: ${lastResult.data?.result_id}, 제목: ${lastResult.data?.title}`}
          </div>
        </div>
      )}
    </div>
  );
};

const TestControlPanel = ({ dark_mode = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isCreating, setIsCreating] = useState(false); // 생성 중 상태
  
  const {
    pending_videos,
    folders,
    simulate_upload,
    select_video,
    add_pending_video
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

  // 1. 영상 생성 (중복 방지 로직 포함)
  const handleCreateVideo = () => {
    if (isCreating) {
      alert('이미 영상 생성 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    setIsCreating(true);
    
    // 🧪 TEST: AI 미디어 모달 열기 이벤트 발생
    const testEvent = new CustomEvent('test-open-ai-media-modal', {
      detail: { 
        testMode: true, 
        platform: selectedPlatform,
        autoFill: true,
        autoSubmit: true // 자동 제출 활성화
      }
    });
    window.dispatchEvent(testEvent);
    
    // 3초 후 생성 버튼 다시 활성화 (충분한 시간 후)
    setTimeout(() => {
      setIsCreating(false);
    }, 3000);
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

    // 자식 영상 데이터 생성 (poi_id 우선, 백엔드 API 호환성 강화)
    const basePoi = selectedVideo.poi_id || selectedVideo.location_id || "POI001";
    const childTempId = generateTempVideoId();
    const parentCanonicalId = selectedVideo.result_id || selectedVideo.id || selectedVideo.temp_id;
    const childVideoData = {
      temp_id: childTempId,
      id: childTempId,
      result_id: childTempId,
      title: `${selectedVideo.title || '테스트 영상'} - 수정본 v${Math.floor(Math.random() * 10) + 2}`,
      poi_id: basePoi, // 백엔드 API 주 필드 (uploadImageToS3Complete 호환)
      location_id: basePoi, // 하위 호환성을 위한 중복 필드
      location_name: selectedVideo.location_name || '강남역',
      image_url: selectedVideo.image_url || '/placeholder-image.jpg',
      thumbnail: selectedVideo.thumbnail || selectedVideo.image_url || '/placeholder-image.jpg', // thumbnail 추가
      user_request: `${selectedVideo.title}의 개선된 버전`,
      prompt: `${selectedVideo.title}의 개선된 버전`, // prompt 필드 추가
      platform: selectedVideo.platform || selectedPlatform,
      status: 'ready',
      parentId: parentCanonicalId,
      parent_id: parentCanonicalId,
      parent_video_id: parentCanonicalId, // 트리 네비게이션을 위한 필수 필드
      version: `1.${Math.floor(Math.random() * 10) + 1}`,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(), // 중복 필드로 호환성 보장
      creation_date: new Date().toISOString().split('T')[0] // 날짜 형식 추가
    };

    // 현재 날짜로 자식 영상을 실제 스토어에 추가
    const creation_date = new Date().toISOString().split('T')[0];
    add_pending_video(childVideoData, creation_date);
    
    // 파생 상태는 스토어가 처리하므로 추가적인 강제 갱신은 생략

    // 트리 구조를 위한 이벤트도 발생 (버전 네비게이션용)
    const parentId = parentCanonicalId;
    const treeData = [
      {
        result_id: parentId,
        title: selectedVideo.title || `테스트 영상 (부모)`,
        platform: selectedVideo.platform || selectedPlatform,
        status: selectedVideo.status || 'ready',
        version: '1.0',
        created_at: selectedVideo.created_at || new Date().toISOString(),
        children: [
          {
            result_id: childVideoData.result_id,
            title: childVideoData.title,
            platform: childVideoData.platform,
            status: childVideoData.status,
            version: childVideoData.version,
            created_at: childVideoData.created_at,
            children: []
          }
        ]
      }
    ];

    const testEvent = new CustomEvent('test-tree-structure', {
      detail: { 
        tree_data: treeData,
        type: 'parent-child',
        message: '부모-자식 버전 관계 생성됨'
      }
    });
    window.dispatchEvent(testEvent);
    
    alert(`자식 버전 "${childVideoData.title}"이 생성되었습니다!`);
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
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  생성 중...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  1. 영상 생성
                </>
              )}
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

          {/* resultId 기반 테스트 섹션 */}
          <div>
            <label className={`text-xs font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-600'}`}>
              🎯 resultId 직접 테스트
            </label>
            <ResultIdTestSection dark_mode={dark_mode} />
          </div>

          {/* S3 영상 직접 추가 섹션 */}
          <div>
            <label className={`text-xs font-medium ${dark_mode ? 'text-gray-300' : 'text-gray-600'}`}>
              📁 S3 영상 직접 추가
            </label>
            <S3VideoAddSection dark_mode={dark_mode} selectedPlatform={selectedPlatform} />
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
