import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogClose, DialogHeader, DialogTitle, DialogDescription } from '@/common/ui/dialog';
import { X as XIcon, Loader } from 'lucide-react';
import { 
  getCommentAnalysis, 
  getRedditCommentAnalysis, 
  getRedditContentById,
  getYouTubeChannelId,
  getYouTubeVideosByChannelId,
} from '@/common/api/api';
import CommentAnalysisView from '@/features/content-modals/ui/CommentAnalysisView';
import GlassCard from '@/common/ui/glass-card';
import { Badge } from '@/common/ui/badge';

const VideoAnalysisModal = ({ contentId, title, platform, onClose }) => {
  const [commentAnalysisData, setCommentAnalysisData] = useState(null);
  const [redditContent, setRedditContent] = useState(null);
  const [youtubeContent, setYouTubeContent] = useState(null);
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
          const [commentData, channelInfo] = await Promise.all([
            getCommentAnalysis(contentId),
            getYouTubeChannelId(),
          ]);
          setCommentAnalysisData(commentData);
          if (channelInfo?.channelId) {
            try {
              const list = await getYouTubeVideosByChannelId(channelInfo.channelId, { sortBy: 'latest', limit: 100 });
              const found = list?.videos?.find(v => v.videoId === contentId);
              setYouTubeContent(found || null);
            } catch (e) {
              // 세부 정보는 선택적: 실패해도 치명적이지 않음
              setYouTubeContent(null);
            }
          }
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
      <DialogContent className="sm:max-w-[1000px] w-full max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-gray-950">
        {/* Sticky 헤더 */}
        <div className="sticky top-0 z-20 bg-white dark:bg-gray-950 border-b border-gray-200/60 dark:border-white/10">
          <DialogHeader className="p-4 sm:p-6">
            {/* 닫기 버튼 */}
            <DialogClose asChild>
              <button
                type="button"
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 rounded-full p-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                aria-label="닫기"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </DialogClose>

            {/* 제목 + 메타 */}
            <div className="flex flex-col gap-2 pr-10">
              <div className="flex items-center gap-2 flex-wrap">
                {platform === 'youtube' && (
                  <Badge variant="outline" className="border-gray-300 text-gray-700 bg-white dark:border-gray-700 dark:text-gray-300 dark:bg-gray-900">YouTube</Badge>
                )}
                {platform === 'reddit' && (
                  <Badge variant="outline" className="border-gray-300 text-gray-700 bg-white dark:border-gray-700 dark:text-gray-300 dark:bg-gray-900">Reddit</Badge>
                )}
                <DialogDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {platform === 'youtube'
                    ? '이 영상에 대한 상세 분석 결과입니다.'
                    : platform === 'reddit'
                    ? (redditContent ? `r/${redditContent?.sub_reddit} • ${redditContent?.upload_date ? new Date(redditContent.upload_date).toLocaleDateString('ko-KR') : ''}` : 'Reddit 게시글 분석')
                    : '분석 결과를 확인할 수 없습니다.'}
                </DialogDescription>
              </div>
              <DialogTitle asChild>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {title || (platform === 'reddit' ? redditContent?.title || 'Reddit 게시글 분석' : '영상 분석')}
                </h2>
              </DialogTitle>
            </div>
          </DialogHeader>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 min-h-0 p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 상단 좌: 영상 플레이어 */}
            <div className="col-span-1">
              <div className="relative w-full aspect-video max-h-[400px] bg-black rounded-xl overflow-hidden flex items-center justify-center">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
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
            </div>

            {/* 상단 우: 영상 설명 */}
            <div className="col-span-1 flex flex-col min-h-0">
              <GlassCard variant="solid" className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 dark:text-white">영상 설명</h3>
                {loading ? (
                  <div className="flex flex-col gap-3 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                ) : (
                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                    {platform === 'youtube' && (
                      <>
                        {youtubeContent?.description ? (
                          <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
                            {youtubeContent.description}
                          </div>
                        ) : (
                          <p className="text-gray-500">영상 설명 정보가 없습니다.</p>
                        )}
                        {youtubeContent?.publishedAt && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            업로드일: {new Date(youtubeContent.publishedAt).toLocaleDateString('ko-KR')}
                          </p>
                        )}
                      </>
                    )}
                    {platform === 'reddit' && (
                      <div className="space-y-2">
                        {redditContent?.text ? (
                          redditContent.text.includes('<') ? (
                            <div className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: redditContent.text }} />
                          ) : (
                            <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">{redditContent.text}</div>
                          )
                        ) : (
                          <p className="text-gray-500">본문이 없습니다.</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {redditContent?.sub_reddit ? `서브레딧: r/${redditContent.sub_reddit}` : ''}
                          {redditContent?.upload_date ? `${redditContent?.sub_reddit ? ' • ' : ''}업로드일: ${new Date(redditContent.upload_date).toLocaleDateString('ko-KR')}` : ''}
                        </p>
                      </div>
                    )}
                    {!platform && <p>플랫폼 정보가 없어 설명을 표시할 수 없습니다.</p>}
                  </div>
                )}
              </GlassCard>
            </div>

            {/* 하단 전체: 댓글 반응 분석 */}
            <div className="col-span-1 lg:col-span-2 flex flex-col min-h-0">
              <GlassCard variant="solid" className="flex-1 flex flex-col">
                <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 dark:text-white">댓글 반응 분석</h3>
                <div className="flex-1 min-h-0">
                  {loading ? (
                    <div className="flex justify-center items-center h-full py-10">
                      <Loader className="w-8 h-8 animate-spin text-gray-400" />
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
