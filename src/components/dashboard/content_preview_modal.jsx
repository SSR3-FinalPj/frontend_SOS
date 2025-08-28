/**
 * ContentPreviewModal 컴포넌트
 * 백엔드 API에서 동적으로 Presigned URL을 가져와서 비디오 재생
 * @description 실제 비디오 재생, 접근성, 로딩/에러 처리, 동적 URL 로딩
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Image, Upload, X as XIcon, AlertCircle, Clock } from 'lucide-react';
import { get_content_type_label } from '../../utils/content_launch_utils.jsx';
import { apiFetch, getVideoResultId } from '../../lib/api.js';

/**
 * 비디오/이미지 콘텐츠를 렌더링하는 컴포넌트
 * @param {Object} item - 미디어 아이템 정보
 * @param {boolean} dark_mode - 다크모드 여부
 * @param {string} videoUrl - 동적으로 로딩된 비디오 URL
 * @param {boolean} apiLoading - API 로딩 상태
 * @param {string} apiError - API 에러 메시지
 */
const MediaViewer = React.memo(({ item, dark_mode, videoUrl, isLoading: apiLoading, error: apiError }) => {
  const [videoLoadState, setVideoLoadState] = useState('loading'); // 'loading', 'loaded', 'error'

  // ▼▼▼▼▼ null 체크 추가 ▼▼▼▼▼
  if (!item) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
        <div className="flex items-center justify-center h-full">
          <AlertCircle className={`h-24 w-24 ${dark_mode ? 'text-gray-600' : 'text-gray-400'}`} />
        </div>
      </div>
    );
  }
  // ▲▲▲▲▲ null 체크 추가 ▲▲▲▲▲

  const handleVideoError = () => {
    setVideoLoadState('error');
  };

  const handleVideoCanPlay = () => {
    setVideoLoadState('loaded');
  };

  const handleVideoLoadStart = () => {
    setVideoLoadState('loading');
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <DialogClose asChild>
        <button
          type="button"
          className="absolute top-3 right-3 z-20 rounded-full p-1.5 bg-black/50 text-white/70 hover:bg-black/70 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="닫기"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </DialogClose>

      {item.type === 'video' ? (
        <>
          {/* API 로딩 상태 */}
          {apiLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-white text-sm">비디오 로딩 중...</span>
            </div>
          )}

          {/* API 에러 상태 */}
          {apiError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/90 gap-3 text-center px-4">
              <AlertCircle className="h-12 w-12 text-red-400" />
              <div>
                <p className="text-white font-medium">비디오를 로드할 수 없습니다</p>
                <p className="text-gray-400 text-sm mt-1">{apiError}</p>
              </div>
            </div>
          )}

          {/* 비디오 로딩 상태 */}
          {videoUrl && videoLoadState === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-white text-xs">스트림 로딩 중...</span>
            </div>
          )}

          {/* 비디오 재생 에러 상태 */}
          {videoUrl && videoLoadState === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/90 gap-3 text-center px-4">
              <AlertCircle className="h-10 w-10 text-red-400" />
              <div>
                <p className="text-white font-medium text-sm">스트림 재생 오류</p>
                <p className="text-gray-400 text-xs mt-1">비디오 파일을 재생할 수 없습니다</p>
              </div>
            </div>
          )}

          {/* 비디오 플레이어 - 동적 URL 또는 폴백 URL 사용 */}
          {((videoUrl && !apiLoading && !apiError) || (!videoUrl && item.video_url)) && (
            <video
              key={videoUrl || item.video_url} // URL 변경 시 비디오 재로드
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                videoLoadState === 'loaded' ? 'opacity-100' : 'opacity-0'
              }`}
              src={videoUrl || item.video_url} // 동적 URL 우선, 없으면 기존 URL 사용
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onError={handleVideoError}
              onCanPlay={handleVideoCanPlay}
              onLoadStart={handleVideoLoadStart}
            >
              <source src={videoUrl || item.video_url} type="video/mp4" />
              브라우저가 비디오를 지원하지 않습니다.
            </video>
          )}

          {/* 비디오 URL이 전혀 없는 경우 */}
          {!videoUrl && !item.video_url && !apiLoading && !apiError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/90 gap-3 text-center px-4">
              <AlertCircle className="h-12 w-12 text-yellow-400" />
              <div>
                <p className="text-white font-medium">비디오 URL을 찾을 수 없습니다</p>
                <p className="text-gray-400 text-sm mt-1">영상이 아직 처리 중일 수 있습니다</p>
              </div>
            </div>
          )}
        </>
      ) : (
        // 이미지 타입이거나 비디오가 아닌 경우
        <div className="flex items-center justify-center h-full">
          <Image className={`h-24 w-24 ${dark_mode ? 'text-gray-600' : 'text-gray-400'}`} />
        </div>
      )}
    </div>
  );
});

// --- 콘텐츠 정보 (제목, 설명, 통계)를 표시하는 컴포넌트 (null 체크 추가) ---
const ContentInfo = React.memo(({ item, dark_mode, testMode = false }) => {
  // ▼▼▼▼▼ null 체크 추가 ▼▼▼▼▼
  if (!item) {
    return (
      <div className="flex-1 space-y-4">
        <div>
          <DialogTitle asChild>
            <h2 className={`text-2xl font-bold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>콘텐츠를 찾을 수 없습니다</h2>
          </DialogTitle>
        </div>
        <DialogDescription asChild>
          <p className={`text-base ${dark_mode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed`}>
            콘텐츠 정보를 불러올 수 없습니다.
          </p>
        </DialogDescription>
      </div>
    );
  }
  // ▲▲▲▲▲ null 체크 추가 ▲▲▲▲▲

  // creationTime 포매팅 함수 (content_item_card와 동일)
  const formatCreationTime = (creationTime) => {
    if (!creationTime) return '';
    const date = new Date(creationTime);
    return date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="flex-1 space-y-4">
      <div>
        <DialogTitle asChild>
          <h2 className={`text-2xl font-bold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
            {testMode && <span className="text-blue-500 text-sm font-normal mr-2">[테스트 모드]</span>}
            {item.title}
          </h2>
        </DialogTitle>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-sm ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>{get_content_type_label(item.type)}</span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        {/* 생성 시작 시간 표시 */}
        {(item.creationTime || item.start_time || item.created_at) && (
          <div className="flex items-center gap-1">
            <Clock className={`h-4 w-4 ${dark_mode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
              생성 시작: {item.creationTime ? formatCreationTime(item.creationTime) : item.start_time ? formatCreationTime(item.start_time) : item.created_at}
            </span>
          </div>
        )}
      </div>
      
      <DialogDescription asChild>
          <p className={`text-base ${dark_mode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed`}>
              {item.description}
          </p>
      </DialogDescription>
    </div>
  );
});

// --- 메인 모달 컴포넌트 (null 체크 강화) ---
const ContentPreviewModal = ({ 
  is_open, 
  item, 
  dark_mode, 
  on_close, 
  on_publish,
  testMode = false  // 테스트 모드 활성화 prop
}) => {
  // 동적 비디오 URL 관리를 위한 상태
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 테스트 모드를 위한 동적 item 상태
  const [dynamicItem, setDynamicItem] = useState(null);

  /**
   * 모달이 열리고 item이 존재할 때 백엔드에서 Presigned URL을 가져오는 useEffect
   * testMode가 활성화되면 완성된 영상 목록에서 최신 영상을 자동으로 선택
   */
  useEffect(() => {
    const fetchVideoUrl = async () => {
      // 모달이 닫혀있으면 실행하지 않음
      if (!is_open) {
        return;
      }

      let targetItem = item;
      let resultId = null;

      // 🧪 테스트 모드: item이 없거나 resultId가 없을 때 동적으로 완성된 영상 조회
      if (testMode && (!item || !(item.video_id || item.id))) {
        try {
          console.log('🧪 [테스트 모드] 완성된 영상 목록 조회 중...');
          const videoResults = await getVideoResultId();
          
          if (!videoResults || !Array.isArray(videoResults) || videoResults.length === 0) {
            throw new Error('완성된 영상이 없습니다');
          }

          // 가장 최신 영상 선택 (첫 번째 항목)
          const latestVideo = videoResults[0];
          if (!latestVideo?.resultId) {
            throw new Error('완성된 영상에서 resultId를 찾을 수 없습니다');
          }

          // 테스트용 item 객체 생성
          targetItem = {
            id: latestVideo.resultId,
            video_id: latestVideo.resultId,
            resultId: latestVideo.resultId,
            title: `테스트 영상 ${latestVideo.resultId}`,
            description: `동적으로 로드된 테스트 영상입니다. ResultId: ${latestVideo.resultId}`,
            type: 'video',
            status: 'ready',
            createdAt: latestVideo.createdAt,
            created_at: latestVideo.createdAt
          };
          
          setDynamicItem(targetItem);
          resultId = latestVideo.resultId;
          
          console.log('🧪 [테스트 모드] 선택된 영상:', {
            resultId: latestVideo.resultId,
            createdAt: latestVideo.createdAt,
            title: targetItem.title
          });
          
        } catch (err) {
          console.error('🧪 [테스트 모드] 완성된 영상 조회 실패:', err);
          setError(`테스트 모드 초기화 실패: ${err.message}`);
          return;
        }
      } else {
        // 일반 모드: 기존 로직
        if (!targetItem) {
          return;
        }
        
        // resultId 확인 (video_id 또는 id 사용)
        resultId = targetItem.video_id || targetItem.id;
      }

      // 비디오 타입이 아니면 API 호출하지 않음
      if (targetItem.type !== 'video') {
        return;
      }

      if (!resultId) {
        setError('비디오 ID를 찾을 수 없습니다.');
        return;
      }

      setIsLoading(true);
      setError(null);
      setVideoUrl(null);

      try {
        const response = await apiFetch('/api/videos/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resultId }),
        });

        if (!response.ok) {
          throw new Error(`비디오 스트림 요청 실패: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.url) {
          setVideoUrl(data.url);
        } else {
          throw new Error('비디오 URL을 받을 수 없습니다.');
        }
      } catch (err) {
        setError(err.message || '비디오 로딩에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoUrl();
  }, [item, is_open, testMode]); // testMode 의존성 추가

  // ▼▼▼▼▼ 테스트 모드 및 null 체크 ▼▼▼▼▼
  if (!is_open) {
    return null;
  }
  
  // 테스트 모드에서는 dynamicItem 사용, 일반 모드에서는 기존 item 사용
  const currentItem = testMode && dynamicItem ? dynamicItem : item;
  
  if (!testMode && !item) {
    // 일반 모드에서 item이 없으면 렌더링하지 않음
    return null;
  }
  // ▲▲▲▲▲ 테스트 모드 및 null 체크 ▲▲▲▲▲

  const handle_publish_click = () => {
    on_close();
    // 테스트 모드에서는 실제 item 전달, 일반 모드에서는 기존 item 사용
    on_publish(testMode && dynamicItem ? dynamicItem : item);
  };

  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && on_close()}>
      <DialogContent className={`max-w-4xl w-[90vw] ${dark_mode ? 'bg-gray-900/90 border-gray-700/20' : 'bg-white/90 border-gray-300/20'} backdrop-blur-2xl rounded-3xl shadow-xl border p-8 space-y-6`}>
        <MediaViewer 
          item={currentItem} 
          dark_mode={dark_mode} 
          videoUrl={videoUrl}
          isLoading={isLoading}
          error={error}
        />
        <div className="flex items-start gap-8">
          <ContentInfo item={currentItem} dark_mode={dark_mode} testMode={testMode} />
          <div className="flex flex-col gap-3 w-40 flex-shrink-0">
            {(currentItem?.status === 'ready') && (
              <Button 
                onClick={handle_publish_click}
                className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 text-gray-800 dark:text-white rounded-xl py-3 text-base"
                disabled={testMode} // 테스트 모드에서는 비활성화
              >
                <Upload className="h-5 w-5 mr-2" />
                {testMode ? '테스트 모드' : '지금 론칭'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// displayName 추가 (디버깅용)
MediaViewer.displayName = 'MediaViewer';
ContentInfo.displayName = 'ContentInfo';

export default React.memo(ContentPreviewModal);