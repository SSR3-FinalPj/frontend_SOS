import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/common/ui/dialog';
import { X as XIcon } from 'lucide-react';
import { getCommentAnalysis, get_traffic_source_summary } from '@/common/api/api';
import TrafficSourceChart from '@/common/ui/TrafficSourceChart';
import CommentAnalysisView from '@/features/content-modals/ui/CommentAnalysisView';

const VideoAnalysisModal = ({ videoId, title, onClose }) => {
  const [commentAnalysisData, setCommentAnalysisData] = useState(null);
  const [trafficSourceData, setTrafficSourceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoId) {
      setLoading(false);
      return;
    }

    const fetchAnalysisData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [commentData, trafficData] = await Promise.all([
          getCommentAnalysis(videoId),
          get_traffic_source_summary(videoId)
        ]);
        setCommentAnalysisData(commentData);
        setTrafficSourceData(trafficData);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [videoId]);

  const youtubeEmbedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

  return (
    <Dialog open={!!videoId} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="max-w-6xl w-[90vw] bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl border p-8 overflow-y-auto max-h-[90vh]">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
              {youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  title={title || 'YouTube video player'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <div className="text-white">비디오 ID가 없습니다.</div>
              )}
            </div>
            <TrafficSourceChart data={trafficSourceData} />
          </div>
          <div className="col-span-1">
            <DialogClose asChild>
              <button
                type="button"
                className="absolute top-3 right-3 z-20 rounded-full p-1.5 bg-black/50 text-white/70 hover:bg-black/70 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="닫기"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </DialogClose>
            <DialogTitle asChild>
              <h2 className="text-2xl font-bold text-gray-900">{title || '영상 분석'}</h2>
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              이 영상에 대한 상세 분석 결과입니다.
            </DialogDescription>
            <div className="mt-6">
              {loading && <div className="text-center text-gray-600">분석 데이터를 불러오는 중...</div>}
              {error && <div className="text-center text-red-500">오류: {error}</div>}
              {!loading && !error && (
                <CommentAnalysisView data={commentAnalysisData} />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoAnalysisModal;