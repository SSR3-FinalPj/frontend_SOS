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
      <DialogContent className="max-w-6xl w-[90vw] h-[90vh] bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-xl border p-8 flex flex-col">
        {/* 닫기 버튼 */}
        <DialogClose asChild>
          <button
            type="button"
            className="absolute top-4 right-4 z-30 rounded-full p-1.5 bg-black/50 text-white/70 hover:bg-black/70 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="닫기"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </DialogClose>

        {/* 제목 영역 */}
        <div className="flex-shrink-0 mb-6">
          <DialogTitle asChild>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pr-12">
              {title || (platform === 'reddit' ? redditContent?.title || 'Reddit 게시글 분석' : '영상 분석')}
            </h2>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {platform === 'youtube'
              ? '이 영상에 대한 상세 분석 결과입니다.'
              : platform === 'reddit'
              ? `r/${redditContent?.sub_reddit} | ${new Date(redditContent?.upload_date).toLocaleDateString('ko-KR')}`
              : '분석 결과를 확인할 수 없습니다.'}
          </DialogDescription>
        </div>

        {/* 메인 콘텐츠 그리드 */}
        <div className="grid grid-cols-3 gap-8 flex-1 min-h-0">
          {/* 왼쪽 컬럼: 미디어 + 본문 */}
          <div className="col-span-2 flex flex-col min-h-0 gap-6">
            {/* 미디어 플레이어 */}
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-brand-secondary-500" />
              ) : platform === 'youtube' ? (
                youtubeEmbedUrl ? (
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
                )
              ) : platform === 'reddit' ? (
                redditContent?.rd_video_url ? (
                  <video
                    src={redditContent.rd_video_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                    (Video not available)
                  </div>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white rounded-xl">
                  미리보기를 제공하지 않는 플랫폼입니다.
                </div>
              )}
            </div>

            {/* Reddit 본문 (스크롤 가능) */}
            {platform === 'reddit' && redditContent?.text && (
              <div className="flex-1 min-h-0 p-4 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg overflow-y-auto custom-scrollbar">
                <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
                  {redditContent.text.includes("<") ? (
                    <div dangerouslySetInnerHTML={{ __html: redditContent.text }} />
                  ) : (
                    <p>{redditContent.text}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽 컬럼: 분석 */}
          <div className="col-span-1 flex flex-col min-h-0">
            <GlassCard className="flex-1 flex flex-col">
              <div className="p-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-brand-primary-600 dark:text-brand-primary-400" />
                  <h3 className="text-lg font-semibold">댓글 반응 분석</h3>
                </div>
              </div>
              <div className="flex-1 min-h-0 px-6 pb-6">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
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
      </DialogContent>
    </Dialog>
  );
};

export default VideoAnalysisModal;
