import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/common/ui/dialog';
import { Button } from '@/common/ui/button';
import { Clock, BarChart2, Download, X as XIcon } from 'lucide-react';
import { getVideoStreamUrl, getVideoDownloadUrl } from '@/common/api/api';

const GeneratedVideoPreviewModal = ({ 
  is_open, 
  item, 
  dark_mode, 
  on_close 
}) => {
  const navigate = useNavigate();

  // 영상 스트리밍을 위한 상태 관리
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 영상 다운로드를 위한 상태 관리
  const [isDownloading, setIsDownloading] = useState(false);

  // 모달이 열릴 때 API를 호출하여 비디오 URL을 가져옴
  useEffect(() => {
    if (is_open) {
      const fetchVideoUrl = async () => {
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);

        try {
          // 실제 아이템의 resultId 사용
          const resultId = item.resultId || item.id || item.video_id;
          if (!resultId) {
            throw new Error('영상 ID를 찾을 수 없습니다.');
          }
          
          const data = await getVideoStreamUrl(resultId);
          setVideoUrl(data.url);
        } catch (err) {
          setError('영상을 불러오는 데 실패했습니다: ' + err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchVideoUrl();
    } else {
      // 모달이 닫힐 때 상태 초기화
      setVideoUrl(null);
      setError(null);
      setIsLoading(false);
    }
  }, [is_open, item]);

  if (!is_open || !item) {
    return null;
  }

  const handleViewAnalytics = () => {
    navigate(`/analytics?videoId=${item.videoId}`);
    on_close();
  };

  // 영상 다운로드 핸들러
  const handleDownload = async () => {
    if (!item || isDownloading) return;

    setIsDownloading(true);

    try {
      // 실제 아이템의 resultId 추출 (스트리밍과 동일한 로직)
      const resultId = item.resultId || item.id || item.video_id;
      if (!resultId) {
        throw new Error('영상 ID를 찾을 수 없습니다.');
      }

      // 다운로드 URL 요청
      const data = await getVideoDownloadUrl(resultId);
      
      // 파일 다운로드 실행
      const link = document.createElement('a');
      link.href = data.url;
      
      // 백엔드에서 파일명을 제공하지 않는 경우 기본 파일명 설정
      const fileName = `video_${resultId}.mp4`;
      link.setAttribute('download', fileName);
      
      // 임시로 DOM에 추가 후 클릭하여 다운로드 시작
      document.body.appendChild(link);
      link.click();
      
      // 사용 후 DOM에서 제거하여 메모리 정리
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('영상 다운로드 실패:', error);
      alert(`다운로드에 실패했습니다: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && on_close()}>
      <DialogContent className={`max-w-4xl w-[90vw] ${dark_mode ? 'bg-gray-900/90 border-gray-700/20' : 'bg-white/90 border-gray-300/20'} backdrop-blur-2xl rounded-3xl shadow-xl border p-8 space-y-6`}>
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
          {isLoading && (
            <div className="text-white text-lg flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span>비디오 로딩 중...</span>
            </div>
          )}
          {error && (
            <div className="text-red-400 p-6 text-center max-w-md">
              <p className="text-lg font-medium mb-3">
                {error.includes('인증') ? '🔐 인증 필요' : 
                 error.includes('권한') ? '🚫 접근 권한 없음' : 
                 error.includes('찾을 수 없습니다') ? '📹 영상 없음' : 
                 '❌ 오류 발생'}
              </p>
              <p className="text-sm mb-4 text-red-300">{error}</p>
              <button
                onClick={() => {
                  const fetchVideoUrl = async () => {
                    setIsLoading(true);
                    setError(null);
                    setVideoUrl(null);

                    try {
                      const resultId = item.resultId || item.id || item.video_id;
                      if (!resultId) {
                        throw new Error('영상 ID를 찾을 수 없습니다.');
                      }
                      
                      const data = await getVideoStreamUrl(resultId);
                      setVideoUrl(data.url);
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setIsLoading(false);
                    }
                  };
                  fetchVideoUrl();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                다시 시도
              </button>
            </div>
          )}
          {videoUrl && !isLoading && !error && (
            <video 
              controls 
              src={videoUrl} 
              className="w-full h-full" 
              preload="metadata"
              style={{ objectFit: 'contain' }}
            >
              <p className="text-white">
                브라우저가 비디오 태그를 지원하지 않습니다.
              </p>
            </video>
          )}
          <DialogClose asChild>
            <button
              type="button"
              className="absolute top-3 right-3 z-20 rounded-full p-1.5 bg-black/50 text-white/70 hover:bg-black/70 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="닫기"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </DialogClose>
        </div>
        <div className="flex items-start gap-8">
          <div className="flex-1 space-y-4">
            <DialogTitle asChild>
              <h2 className={`text-2xl font-bold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
                {item.title || 'AI 생성 영상'}
              </h2>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{formatDate(item.createdAt || item.creation_date)}</span>
              </div>
            </DialogDescription>
          </div>
          <div className="flex flex-col gap-3 w-40 flex-shrink-0">
            <Button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30 text-gray-800 dark:text-white rounded-xl py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-5 w-5 mr-2" />
              {isDownloading ? '다운로드 중...' : '다운로드'}
            </Button>
            <Button 
              onClick={handleViewAnalytics}
              className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 text-gray-800 dark:text-white rounded-xl py-3 text-base"
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              분석하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(GeneratedVideoPreviewModal);