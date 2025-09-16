import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/common/ui/dialog';
import { Button } from '@/common/ui/button';
import { Clock, BarChart2, X as XIcon, ExternalLink, Wand2 } from 'lucide-react';
import { getCommentAnalysis, getRedditContentById, getRedditCommentAnalysis } from '@/common/api/api';
import CommentAnalysisView from './CommentAnalysisView';

const ContentPreviewModal = ({
  is_open,
  item,
  dark_mode,
  on_close,
  viewMode = 'simple', // 'simple' or 'detailed'
  mode = 'analytics',
  on_edit
}) => {
  const navigate = useNavigate();
  const [commentAnalysisData, setCommentAnalysisData] = useState(null);
  const [redditContent, setRedditContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!item) return;

      setLoading(true);
      setCommentAnalysisData(null);
      setRedditContent(null);

      try {
        if (item.platform === 'YouTube') {
          if (viewMode === 'detailed') {
            const commentData = await getCommentAnalysis(item.id);
            setCommentAnalysisData(commentData);
          }
        } else if (item.platform === 'Reddit') {
          const [redditData, commentData] = await Promise.all([
            getRedditContentById(item.id),
            viewMode === 'detailed' ? getRedditCommentAnalysis(item.id) : Promise.resolve(null)
          ]);
          setRedditContent(redditData);
          if (commentData) setCommentAnalysisData(commentData);
        }
      } catch (error) {
        console.error("Failed to fetch modal data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (is_open) {
      fetchData();
    }
  }, [is_open, item, viewMode]);

  if (!is_open || !item) {
    return null;
  }

  const handleViewAnalytics = () => {
    if (item.platform === 'YouTube') {
      navigate(`/analytics?videoId=${item.id}`);
    } else if (item.platform === 'Reddit') {
      navigate(`/analytics?postId=${item.id}`);
    }
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

  const simpleView = (
    <DialogContent
      className={`max-w-4xl w-[90vw] ${dark_mode ? 'bg-gray-900/90 border-gray-700/20' : 'bg-white/90 border-gray-300/20'
        } backdrop-blur-2xl rounded-3xl shadow-xl border p-8 space-y-6`}
    >
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
        {item.platform === 'YouTube' ? (
          <iframe
            src={`https://www.youtube.com/embed/${item.id}`}
            title={item.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        ) : item.platform === 'Reddit' ? (
          <div
            className={`w-full h-full flex flex-col ${dark_mode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
              }`}
          >
            {/* 🔹 Reddit 비디오 영역 (있으면 보여주고, 없으면 건너뜀) */}
            {redditContent?.rd_video_url && (
              <div className="w-full aspect-video bg-black">
                <video
                  src={redditContent.rd_video_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 🔹 Reddit 텍스트 영역 */}
            <div className="p-6 overflow-y-auto flex-1">
              {loading ? (
                <p>Loading Reddit post...</p>
              ) : redditContent ? (
                <div>
                  <h3 className="text-lg font-bold">{redditContent.title}</h3>
                  <p className="text-sm text-gray-400">
                    in r/{redditContent.sub_reddit} on {formatDate(redditContent.upload_date)}
                  </p>
                  <hr className="my-4" />
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words">
                    {redditContent.text && redditContent.text.trim() !== "" ? (
                      redditContent.text.includes("<") ? (
                        // HTML 태그 포함된 경우
                        <div dangerouslySetInnerHTML={{ __html: redditContent.text }} />
                      ) : (
                        // 순수 텍스트인 경우
                        <p>{redditContent.text}</p>
                      )
                    ) : (
                      <span className="text-gray-400 italic">본문 없음</span>
                    )}
                  </div>
                </div>
              ) : (
                <p>Could not load Reddit post.</p>
              )}
            </div>
          </div>
        ) : null}

        {/* 닫기 버튼 */}
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

      {/* 🔹 타이틀 + 버튼 영역 */}
      <div className="flex items-start gap-8">
        <div className="flex-1 space-y-4">
          <DialogTitle asChild>
            <h2 className={`text-2xl font-bold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>
              {item.title}
            </h2>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatDate(item.uploadDate)}</span>
            </div>
          </DialogDescription>
        </div>

        <div className="flex flex-col gap-3 w-40 flex-shrink-0">
          {item.platform === 'YouTube' &&
            (mode === 'launch' ? (
              <Button
                onClick={() => on_edit && on_edit(item)}
                className="w-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 hover:from-orange-500/30 hover:to-yellow-500/30 text-gray-800 dark:text-white rounded-xl py-3 text-base"
              >
                <Wand2 className="h-5 w-5 mr-2" />
                수정하기
              </Button>
            ) : (
              <Button
                onClick={handleViewAnalytics}
                variant="brand"
                className="w-full rounded-xl py-3 text-base"
              >
                <BarChart2 className="h-5 w-5 mr-2" />
                분석하기
              </Button>
            ))}

          {item.platform === 'Reddit' && (
            <>
              {mode === 'launch' ? (
                <Button
                  onClick={() => on_edit && on_edit(item)}
                  className="w-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 hover:from-orange-500/30 hover:to-yellow-500/30 text-gray-800 dark:text-white rounded-xl py-3 text-base"
                >
                  <Wand2 className="h-5 w-5 mr-2" />
                  수정하기
                </Button>
              ) : (
                <Button
                  onClick={handleViewAnalytics}
                  variant="brand"
                  className="w-full rounded-xl py-3 text-base"
                >
                  <BarChart2 className="h-5 w-5 mr-2" />
                  분석하기
                </Button>
              )}
              <Button
                onClick={() => window.open(item.url, '_blank')}
                className="w-full bg-gray-500/20 border border-gray-500/30 hover:bg-gray-500/30 text-gray-800 dark:text-white rounded-xl py-3 text-base"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                링크 이동
              </Button>
            </>
          )}
        </div>
      </div>
    </DialogContent>
  );

  const detailedView = (
    <DialogContent className={`max-w-6xl w-[90vw] ${dark_mode ? 'bg-gray-900/90 border-gray-700/20' : 'bg-white/90 border-gray-300/20'} backdrop-blur-2xl rounded-3xl shadow-xl border p-8 space-y-6`}>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
            {item.platform === 'YouTube' ? (
              <iframe
                src={`https://www.youtube.com/embed/${item.id}`}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            ) : item.platform === 'Reddit' ? (
              <div className={`w-full h-full flex flex-col ${dark_mode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
                <div className="w-full aspect-video bg-black">
                  {redditContent?.rd_video_url ? (
                    <video
                      src={redditContent.rd_video_url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No video available
                    </div>
                  )}
                </div>
                {/* 🔹 Reddit 텍스트 영역 */}
                <div className="p-6 overflow-y-auto flex-1">
                  {loading ? (
                    <p>Loading Reddit post...</p>
                  ) : redditContent ? (
                    <div>
                      <h3 className="text-lg font-bold">{redditContent.title}</h3>
                      <p className="text-sm text-gray-400">
                        in r/{redditContent.sub_reddit} on {formatDate(redditContent.upload_date)}
                      </p>
                      <hr className="my-4" />
                      <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words">
                        {redditContent.text && redditContent.text.trim() !== "" ? (
                          redditContent.text.includes("<") ? (
                            // HTML 태그 포함된 경우
                            <div dangerouslySetInnerHTML={{ __html: redditContent.text }} />
                          ) : (
                            // 순수 텍스트인 경우
                            <p>{redditContent.text}</p>
                          )
                        ) : (
                          <span className="text-gray-400 italic">본문 없음</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p>Could not load Reddit post.</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
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
            <h2 className={`text-2xl font-bold ${dark_mode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h2>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
              <Clock className="w-4 h-4" />
              <span>{formatDate(item.uploadDate)}</span>
            </div>
          </DialogDescription>
          <div className="mt-6">
            {item.platform === 'YouTube' && <CommentAnalysisView data={commentAnalysisData} />}
            {item.platform === 'Reddit' && <CommentAnalysisView data={commentAnalysisData} />}
          </div>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && on_close()}>
      {viewMode === 'simple' ? simpleView : detailedView}
    </Dialog>
  );
};

export default ContentPreviewModal;
