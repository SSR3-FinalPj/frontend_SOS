/**
 * ContentPreviewModal 컴포넌트
 * 실제 비디오 재생, 접근성, 로딩/에러 처리 최종본 - null 체크 추가
 */
import React, { useState, useEffect } from 'react';
// DialogTitle과 DialogDescription을 import에 추가합니다.
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Image, TrendingUp, Eye, Upload, X as XIcon, AlertCircle } from 'lucide-react';
import { get_platform_color, get_content_type_label } from '../../utils/content_launch_utils.jsx';
import { getEmbeddableVideoUrl } from '../../utils/video_url_utils.js';

// --- 비디오/이미지 콘텐츠를 렌더링하는 컴포넌트 (null 체크 추가) ---
const MediaViewer = React.memo(({ item, dark_mode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // ▼▼▼▼▼ null 체크 추가 ▼▼▼▼▼
  if (!item) {
    console.warn('MediaViewer: item is null or undefined');
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
        <div className="flex items-center justify-center h-full">
          <AlertCircle className={`h-24 w-24 ${dark_mode ? 'text-gray-600' : 'text-gray-400'}`} />
        </div>
      </div>
    );
  }
  // ▲▲▲▲▲ null 체크 추가 ▲▲▲▲▲

  const handleVideoError = (e) => {
    console.error('❌ Video loading error occurred');
    console.error('Failed video URL:', item.video_url);
    console.error('Error details:', e.target?.error);
    
    // 에러 타입에 따른 상세 정보
    if (e.target?.error) {
      const errorCode = e.target.error.code;
      const errorMessage = e.target.error.message;
      console.error(`Error Code: ${errorCode}, Message: ${errorMessage}`);
      
      switch (errorCode) {
        case 1:
          console.error('MEDIA_ERR_ABORTED: 비디오 로딩이 중단되었습니다.');
          break;
        case 2:
          console.error('MEDIA_ERR_NETWORK: 네트워크 오류로 비디오를 로드할 수 없습니다.');
          break;
        case 3:
          console.error('MEDIA_ERR_DECODE: 비디오 디코딩 오류가 발생했습니다.');
          break;
        case 4:
          console.error('MEDIA_ERR_SRC_NOT_SUPPORTED: 지원되지 않는 비디오 형식입니다.');
          break;
        default:
          console.error('알 수 없는 비디오 오류가 발생했습니다.');
      }
    }
    
    setIsLoading(false);
    setHasError(true);
  };

  const handleVideoCanPlay = () => {
    console.log('Video loaded successfully:', item.video_url);
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoLoadStart = () => {
    console.log('Video load started:', item.video_url);
    setIsLoading(true);
    setHasError(false);
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
          {/* 로딩 상태 */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-white text-sm">비디오 로딩 중...</span>
              <span className="text-white/70 text-xs">URL: {item.video_url?.slice(0, 50)}...</span>
            </div>
          )}

          {/* 에러 상태 */}
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/90 gap-3 text-center px-4">
              <AlertCircle className="h-12 w-12 text-red-400" />
              <div>
                <p className="text-white font-medium">비디오를 로드할 수 없습니다</p>
                <p className="text-gray-400 text-sm mt-1">네트워크 상태나 비디오 URL을 확인해주세요</p>
                <p className="text-gray-500 text-xs mt-2 break-all">URL: {item.video_url}</p>
              </div>
            </div>
          )}

          {/* 비디오 플레이어 - CORS 및 로딩 최적화 */}
          {item.video_url && (
            <video
              key={item.video_url} // URL 변경 시 비디오 재로드
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                isLoading || hasError ? 'opacity-0' : 'opacity-100'
              }`}
              src={item.video_url}
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="auto" // 빠른 로딩을 위해 전체 비디오 미리 로드
              onError={handleVideoError}
              onCanPlay={handleVideoCanPlay}
              onLoadStart={handleVideoLoadStart}
              onLoadedData={() => console.log('✅ Video data loaded successfully')}
              onLoadedMetadata={() => console.log('✅ Video metadata loaded successfully')}
              onWaiting={() => console.log('⏳ Video buffering...')}
              onCanPlayThrough={() => console.log('✅ Video ready to play through')}
            >
              <source src={item.video_url} type="video/mp4" />
              브라우저가 비디오를 지원하지 않습니다.
            </video>
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
const ContentInfo = React.memo(({ item, dark_mode }) => {
  // ▼▼▼▼▼ null 체크 추가 ▼▼▼▼▼
  if (!item) {
    console.warn('ContentInfo: item is null or undefined');
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

  return (
    <div className="flex-1 space-y-4">
      <div>
        <DialogTitle asChild>
          <h2 className={`text-2xl font-bold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h2>
        </DialogTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge className={`${get_platform_color(item.platform)} rounded-full px-3 py-1`}>{item.platform}</Badge>
          <span className={`text-sm ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>{get_content_type_label(item.type)}</span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className={`${dark_mode ? 'text-gray-300' : 'text-gray-700'}`}>
            예상 참여율: <span className="font-semibold">{item.engagement_score}%</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="h-4 w-4 text-blue-500" />
          <span className={`${dark_mode ? 'text-gray-300' : 'text-gray-700'}`}>
            예상 조회수: <span className="font-semibold">{item.estimated_views?.toLocaleString()}</span>
          </span>
        </div>
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
  on_publish 
}) => {
  // ▼▼▼▼▼ 더 안전한 null 체크 ▼▼▼▼▼
  if (!item) {
    console.warn('ContentPreviewModal: item is null, modal should not be open');
    // item이 null이면 모달을 열지 않음
    return null;
  }
  // ▲▲▲▲▲ 더 안전한 null 체크 ▲▲▲▲▲

  const handle_publish_click = () => {
    on_close();
    on_publish(item);
  };

  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && on_close()}>
      <DialogContent className={`max-w-4xl w-[90vw] ${dark_mode ? 'bg-gray-900/90 border-gray-700/20' : 'bg-white/90 border-gray-300/20'} backdrop-blur-2xl rounded-3xl shadow-xl border p-8 space-y-6`}>
        <MediaViewer item={item} dark_mode={dark_mode} />
        <div className="flex items-start gap-8">
          <ContentInfo item={item} dark_mode={dark_mode} />
          <div className="flex flex-col gap-3 w-40 flex-shrink-0">
            {item.status === 'ready' && (
              <Button 
                onClick={handle_publish_click}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl py-3 text-base"
              >
                <Upload className="h-5 w-5 mr-2" />
                지금 론칭
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