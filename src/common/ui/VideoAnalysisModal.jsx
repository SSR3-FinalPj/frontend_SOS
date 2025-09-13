import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/common/ui/dialog';
import { X as XIcon, Loader2, MessageSquare } from 'lucide-react';
import { getCommentAnalysis, getRedditCommentAnalysis, getRedditContentById } from '@/common/api/api';
import CommentAnalysisView from '@/features/content-modals/ui/CommentAnalysisView';
import GlassCard from '@/common/ui/glass-card';

const VideoAnalysisModal = ({ contentId, title, platform, onClose }) => {
  const [commentAnalysisData, setCommentAnalysisData] = useState(null);
  const [redditContent, setRedditContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contentId || !platform) {
      setLoading(false);
      return;
    }

    const fetchAnalysisData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (platform === 'youtube') {
          const commentData = await getCommentAnalysis(contentId);
          setCommentAnalysisData(commentData);
        } else if (platform === 'reddit') {
          const [postData, commentData] = await Promise.all([
            getRedditContentById(contentId),
            getRedditCommentAnalysis(contentId)
          ]);
          setRedditContent(postData);
          setCommentAnalysisData(commentData);
        }
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [contentId, platform]);

  const youtubeEmbedUrl =
    contentId && platform === 'youtube'
      ? `https://www.youtube.com/embed/${contentId}`
      : '';

  return (
    <Dialog open={!!contentId} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="max-w-6xl w-[90vw] bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-xl border p-8 overflow-y-auto max-h-[90vh]">
        <div className="grid grid-cols-3 gap-8">
          {/* 왼쪽 콘텐츠 영역 */}
          <div className="col-span-2 space-y-6">
            {platform === 'youtube' ? (
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
            ) : platform === 'reddit' ? (
              <div
                className={`w-full h-full p-6 rounded-xl overflow-y-auto ${
                  error
                    ? 'flex items-center justify-center text-red-500'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              >
                {loading ? (
                  <p>Reddit 게시글을 불러오는 중...</p>
                ) : redditContent ? (
                  <div>
                    <h3 className="text-lg font-bold mb-2">{redditContent.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      in r/{redditContent.sub_reddit} on{' '}
                      {new Date(redditContent.upload_date).toLocaleDateString('ko-KR')}
                    </p>
                    <div
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: redditContent.text }}
                    ></div>
                  </div>
                ) : (
                  <p>게시글을 불러오지 못했습니다.</p>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white rounded-xl">
                미리보기를 제공하지 않는 플랫폼입니다.
              </div>
            )}
          </div>

          {/* 오른쪽 분석 영역 */}
          <div className="col-span-1 relative">
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {title || (platform === 'reddit' ? 'Reddit 게시글 분석' : '영상 분석')}
                </h2>
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                {platform === 'youtube'
                  ? '이 영상에 대한 상세 분석 결과입니다.'
                  : platform === 'reddit'
                  ? '이 게시글에 대한 상세 분석 결과입니다.'
                  : '분석 결과를 확인할 수 없습니다.'}
              </DialogDescription>
            </div>

            <div className="mt-6">
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-6 h-6 text-brand-primary-600 dark:text-brand-primary-400" />
                    <h3 className="text-lg font-semibold">댓글 반응 분석</h3>
                  </div>
                  {loading ? (
                    <div className="flex justify-center items-center h-48">
                      <Loader2 className="w-8 h-8 animate-spin text-brand-secondary-500" />
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
