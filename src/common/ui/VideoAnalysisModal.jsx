import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/common/ui/dialog';
import { X as XIcon } from 'lucide-react';
import { apiFetch, getCommentAnalysis } from '@/common/api/api';

const VideoAnalysisModal = ({ videoId, title, onClose }) => {
  const [topComments, setTopComments] = useState([]);
  const [atmosphereSummary, setAtmosphereSummary] = useState('');
  const [trafficData, setTrafficData] = useState([]);
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
        const commentData = await getCommentAnalysis(videoId);
        setTopComments(commentData.top3 || []);
        setAtmosphereSummary(commentData.atmosphere || '분석 결과 없음');


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
      <DialogContent className="max-w-4xl w-[90vw] bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl border p-8 overflow-y-auto max-h-[90vh]">
        <div className="space-y-6">
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

          <DialogTitle asChild>
            <h2 className="text-2xl font-bold text-gray-900">{title || '영상 분석'}</h2>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            이 영상에 대한 상세 분석 결과입니다.
          </DialogDescription>

          {loading && <div className="text-center text-gray-600">분석 데이터를 불러오는 중...</div>}
          {error && <div className="text-center text-red-500">오류: {error}</div>}

          {!loading && !error && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gray-100/50 border border-gray-300/30">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">댓글 Top3</h4>
                {topComments.length > 0 ? (
                  <ul className="space-y-2 text-sm text-gray-700">
                    {topComments.map((comment, index) => (
                      <li key={index}>
                        {index + 1}. <span className="font-medium">{comment.author}</span>: {comment.text}
                        <span className="ml-2 text-gray-500">
                          👍 {comment.likes_or_score} 💬 {comment.replies}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">댓글 데이터가 없습니다.</p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-gray-100/50 border border-gray-300/30">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">댓글 반응 분석 요약</h4>
                <p className="text-sm text-gray-700">{atmosphereSummary}</p>
              </div>

              
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoAnalysisModal;