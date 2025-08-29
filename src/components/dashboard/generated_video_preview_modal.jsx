import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Clock, BarChart2, X as XIcon } from 'lucide-react';
import { getVideoStreamUrl } from '../../lib/api';

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

  // 모달이 열릴 때 API를 호출하여 비디오 URL을 가져옴
  useEffect(() => {
    if (is_open) {
      const fetchVideoUrl = async () => {
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);

        try {
          // getVideoStreamUrl 함수 사용 (resultId 생략 시 테스트용 기본값 1 사용)
          const data = await getVideoStreamUrl();
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
  }, [is_open]);

  if (!is_open || !item) {
    return null;
  }

  const handleViewAnalytics = () => {
    navigate(`/analytics?videoId=${item.videoId}`);
    on_close();
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
            <div className="text-red-400 p-4 text-center max-w-md">
              <p className="text-lg font-medium mb-2">오류 발생</p>
              <p className="text-sm">{error}</p>
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