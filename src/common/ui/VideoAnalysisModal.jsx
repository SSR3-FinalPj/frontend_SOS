import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/common/ui/dialog';
import { X as XIcon, Loader2, BarChart2, MessageSquare } from 'lucide-react';
import { getCommentAnalysis, get_traffic_source_summary } from '@/common/api/api';
import TrafficSourceChart from '@/common/ui/TrafficSourceChart';
import CommentAnalysisView from '@/features/content-modals/ui/CommentAnalysisView';
import GlassCard from '@/common/ui/glass-card';

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
      <DialogContent className="max-w-6xl w-[90vw] bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-xl border p-8 overflow-y-auto max-h-[90vh]">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
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
            <GlassCard>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart2 className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-semibold">트래픽 소스</h3>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <TrafficSourceChart data={trafficSourceData} />
                )}
              </div>
            </GlassCard>
          </div>
          <div className="col-span-1">
            <DialogClose asChild>
              <button
                type="button"
                className="absolute top-4 right-4 z-20 rounded-full p-1.5 bg-black/50 text-white/70 hover:bg-black/70 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="닫기"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </DialogClose>
            <div className="space-y-4">
                <DialogTitle asChild>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title || '영상 분석'}</h2>
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                  이 영상에 대한 상세 분석 결과입니다.
                </DialogDescription>
            </div>
            <div className="mt-6">
              <GlassCard>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <MessageSquare className="w-6 h-6 text-green-500" />
                        <h3 className="text-lg font-semibold">댓글 반응 분석</h3>
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500">오류: {error}</div>
                    ) : (
                        <CommentAnalysisView data={commentAnalysisData} />
                    )}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoAnalysisModal;