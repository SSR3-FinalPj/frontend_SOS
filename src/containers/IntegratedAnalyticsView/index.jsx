/**
 * IntegratedAnalyticsView 컴포넌트
 * 통합 분석 뷰 - 플랫폼 간 성과 비교 분석
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { Search, Play, MessageSquare, Loader, MessageCircle, ThumbsUp, ExternalLink, Info, X as XIcon } from 'lucide-react';
import GlassCard from '@/common/ui/glass-card';
import YouTubeIcon from '@/assets/images/button/Youtube_Icon.svg';
import RedditIcon from '@/assets/images/button/Reddit_Icon.svg';
import { getCommonContentList, getComparisonDetails } from '@/common/api/api';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/common/ui/tooltip";
import { Dialog, DialogContent } from "@/common/ui/dialog";

// --- Main Component --- 
const IntegratedAnalyticsView = () => {
  const [allContent, setAllContent] = useState([]);
  const [selectedContentDetails, setSelectedContentDetails] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [modalVideo, setModalVideo] = useState({ url: '', title: '' });
  const [autoPreview, setAutoPreview] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoadingList(true);
        setError(null);
        const contentList = await getCommonContentList();
        setAllContent(contentList);
      } catch (e) {
        setError("콘텐츠 목록을 불러오는 데 실패했습니다.");
        console.error(e);
      } finally {
        setIsLoadingList(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleSelectContent = useCallback(async (content) => {
    try {
      setIsLoadingDetails(true);
      setError(null);
      setSelectedContentDetails(null);

      const details = await getComparisonDetails(content.resultId);
      if (!details) throw new Error('No details returned from API');

      const youtubeScore = details.youtube && details.youtube.view_count > 0
        ? ((details.youtube.like_count * 0.5) + (details.youtube.comment_count * 0.8)) / details.youtube.view_count
        : 0;
      
      const redditScore = details.reddit && details.reddit.score > 0
        ? ((details.reddit.upvote) + (details.reddit.comment_count )) / details.reddit.score
        : 0;

      const mappedData = {
        title: details.youtube?.title || details.reddit?.title || content.title,
        uploadDate: details.youtube?.upload_date || details.reddit?.upload_date,
        youtube: details.youtube ? { ...details.youtube, views: details.youtube.view_count, likes: details.youtube.like_count, comments: details.youtube.comment_count, thumbnail: details.youtube.thumbnail_url, engagementScore: youtubeScore } : null,
        reddit: details.reddit ? { ...details.reddit, upvotes: details.reddit.upvote, comments: details.reddit.comment_count, engagementScore: redditScore } : null,
        comments: { youtube: details.youtube_comments, reddit: details.reddit_comments }
      };
      setSelectedContentDetails(mappedData);
    } catch (e) {
      setError("상세 정보를 불러오는 데 실패했습니다.");
      console.error(e);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  // const openVideoModal = (url, title) => {
  //   setModalVideo({ url, title });
  //   setIsVideoModalOpen(true);
  // };

  // --- Sub-components --- 

  // 검색어 하이라이트 함수
  const highlightText = (text, searchQuery) => {
    if (!searchQuery || !text) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark
            key={index}
            className="bg-yellow-200/70 dark:bg-yellow-400/20 px-1 py-0.5 rounded text-gray-900 dark:text-yellow-100 transition-all duration-200"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  const CrossPlatformSearchCard = ({ onSelectContent, allContent, isLoading }) => {
    const [query, setQuery] = React.useState('');
    const [filteredResults, setFilteredResults] = React.useState([]);
    const inputRef = React.useRef(null);
    const [anchorRect, setAnchorRect] = React.useState(null);
    const thumbsCache = React.useRef(new Map());
    const [thumbs, setThumbs] = React.useState({});

    React.useEffect(() => {
      if (query.length < 1) {
        setFilteredResults([]);
        setThumbs({});
        return;
      }
      if (allContent && allContent.length > 0) {
        const results = allContent.filter(content => content.title.toLowerCase().includes(query.toLowerCase()));
        setFilteredResults(results);
      }
    }, [query, allContent]);

    // 고정 레이어 위치 계산
    const recalcAnchor = React.useCallback(() => {
      if (!inputRef.current) return;
      const rect = inputRef.current.getBoundingClientRect();
      setAnchorRect({ left: rect.left, top: rect.top, bottom: rect.bottom, width: rect.width });
    }, []);

    React.useEffect(() => {
      recalcAnchor();
      window.addEventListener('resize', recalcAnchor);
      window.addEventListener('scroll', recalcAnchor, true);
      return () => {
        window.removeEventListener('resize', recalcAnchor);
        window.removeEventListener('scroll', recalcAnchor, true);
      };
    }, [recalcAnchor]);

    // 상위 N개 결과 썸네일 프리패치
    React.useEffect(() => {
      const fetchThumbs = async () => {
        const top = (filteredResults || []).slice(0, 6);
        const updates = {};
        await Promise.all(top.map(async (item) => {
          if (thumbsCache.current.has(item.resultId)) {
            updates[item.resultId] = thumbsCache.current.get(item.resultId);
            return;
          }
          try {
            const details = await getComparisonDetails(item.resultId);
            const ytThumb = details?.youtube?.thumbnail_url || details?.youtube?.thumbnail;
            const rdThumb = details?.reddit?.thumbnail_url || null;
            const val = { yt: ytThumb, rd: rdThumb };
            thumbsCache.current.set(item.resultId, val);
            updates[item.resultId] = val;
          } catch (_) { /* ignore */ }
        }));
        if (Object.keys(updates).length) {
          setThumbs((prev) => ({ ...prev, ...updates }));
        }
      };
      if ((filteredResults || []).length) fetchThumbs();
    }, [filteredResults]);

    const handleSelectItem = (content) => {
      onSelectContent(content);
      setQuery('');
      setFilteredResults([]);
    };

    const handleClearSearch = () => setQuery('');

    return (
      <GlassCard className="relative overflow-hidden" hover={false}>
        {/* 백그라운드 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary-50/20 via-transparent to-brand-primary-50/20 dark:from-brand-secondary-950/10 dark:via-transparent dark:to-brand-primary-950/10 pointer-events-none" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-secondary-500 dark:text-brand-secondary-400" />
          <input
            type="text"
            placeholder="비교할 콘텐츠 제목을 검색해보세요..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputRef}
            className="w-full pl-12 pr-10 py-4 backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-2 border-transparent focus:border-brand-secondary-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary-500/40 focus:bg-white/80 dark:focus:bg-gray-700/60 rounded-xl transition-all duration-300"
            disabled={isLoading}
          />
          {query && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-brand-secondary-400 hover:text-brand-secondary-600 dark:hover:text-brand-secondary-300 transition-colors hover:scale-110 duration-200"
            >
              ×
            </button>
          )}
        </div>
        {isLoading && (
          <div className="p-4 text-center text-brand-secondary-500 dark:text-brand-secondary-400">
            <Loader className="w-6 h-6 mx-auto animate-spin text-brand-secondary-500 dark:text-brand-secondary-400" />
          </div>
        )}
        {query.length > 0 && !isLoading && anchorRect && ReactDOM.createPortal(
          (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'fixed', left: anchorRect.left, top: anchorRect.bottom + 8, width: anchorRect.width, zIndex: 50 }}
              className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-brand-secondary-200/30 dark:border-brand-secondary-700/30 rounded-xl shadow-xl max-h-80 overflow-y-auto"
            >
              {filteredResults.length > 0 ? (
                filteredResults.map((content) => {
                  const thumb = thumbs[content.resultId];
                  const imgSrc = thumb?.yt || thumb?.rd || null;
                  return (
                    <button key={content.resultId} onClick={() => handleSelectItem(content)} className="w-full p-3 text-left transition-colors duration-150 border-b border-brand-secondary-100/30 dark:border-brand-secondary-800/30 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-16 aspect-video rounded-md overflow-hidden bg-gray-200/60 dark:bg-gray-700/40 flex-shrink-0">
                          {imgSrc ? (
                            <img src={imgSrc} alt={content.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full animate-pulse bg-gray-300/60 dark:bg-gray-700/60" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-base text-gray-800 dark:text-white line-clamp-1">{highlightText(content.title, query)}</h5>
                            {content.youtube && <img src={YouTubeIcon} alt="YouTube" className="w-4 h-4" />}
                            {content.reddit && <img src={RedditIcon} alt="Reddit" className="w-4 h-4" />}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">업로드: {new Date(content.uploadedAt).toLocaleDateString('ko-KR')}</p>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-center text-brand-secondary-400 dark:text-brand-secondary-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-60 text-brand-secondary-400" />
                  <p className="text-sm">검색 결과가 없습니다</p>
                </div>
              )}
            </motion.div>
          ), document.body)
        }
      </GlassCard>
    );
  };

  const UnifiedComparisonView = ({ details, autoPreview, setAutoPreview }) => {
    const { title, uploadDate, youtube, reddit, comments } = details;

    // in-view helper for lazy embedding
    const useInView = () => {
      const ref = useRef(null);
      const [inView, setInView] = useState(false);
      useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver((entries) => {
          if (entries[0]) setInView(entries[0].isIntersecting);
        }, { threshold: 0.25 });
        obs.observe(el);
        return () => { try { obs.unobserve(el); } catch(_) {} };
      }, []);
      return [ref, inView];
    };

    const ComparisonRow = ({ metricName, youtubeValue, redditValue, tooltipText }) => {
      const formatValue = (value) => {
        if (typeof value !== 'number') return value;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
        if (value < 1 && value > 0) return value.toFixed(3);
        return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
      };

      // 비교 값 우위 판단 로직
      const compareValues = (ytValue, rdValue) => {
        const numYT = typeof ytValue === 'number' ? ytValue : 0;
        const numRD = typeof rdValue === 'number' ? rdValue : 0;

        // 둘 다 0이거나 숫자가 아닌 경우 비교 안함
        if ((numYT === 0 && numRD === 0) || (typeof ytValue !== 'number' && typeof rdValue !== 'number')) {
          return { youtubeHigher: false, redditHigher: false };
        }

        return {
          youtubeHigher: numYT > numRD && numYT > 0,
          redditHigher: numRD > numYT && numRD > 0
        };
      };

      const { youtubeHigher, redditHigher } = compareValues(youtubeValue, redditValue);

      const metricContent = (
        <div className="relative flex items-center justify-center gap-1.5">
          <span className="text-lg font-semibold text-brand-secondary-700 dark:text-brand-secondary-300">{metricName}</span>
          {tooltipText && (
            <TooltipProvider delayDuration={120}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className="inline-flex items-center justify-center w-5 h-5 rounded-full text-brand-secondary-600 dark:text-brand-secondary-300 bg-brand-secondary-100/60 dark:bg-brand-secondary-900/30 cursor-help">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );

      return (
        <div className="grid grid-cols-3 items-center py-3.5 border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0 rounded-lg px-2 -mx-2">
          <span className={`text-xl text-right font-medium ${
            youtubeHigher
              ? 'text-gray-900 dark:text-white bg-yellow-100/60 dark:bg-yellow-500/15 px-2 py-1 rounded font-semibold shadow-sm'
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {formatValue(youtubeValue)}
          </span>
          {metricContent}
          <span className={`text-xl text-left font-medium ${
            redditHigher
              ? 'text-gray-900 dark:text-white bg-yellow-100/60 dark:bg-yellow-500/15 px-2 py-1 rounded font-semibold shadow-sm'
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {formatValue(redditValue)}
          </span>
        </div>
      );
    };

    const TopCommentList = ({ commentData, platformColor }) => {
      if (!commentData?.['top comments']?.length) return <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-4">주요 댓글이 없습니다.</p>;
      return (
        <div className="space-y-3 mt-4">
          {commentData['top comments'].map(comment => (
            <div key={comment.rank} className={`p-3 backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 rounded-lg text-left border-l-4 ${platformColor} shadow-sm hover:shadow-md transition-shadow duration-200`}>
              <p className="text-gray-800 dark:text-gray-200 text-sm mb-2 font-medium">{comment.text}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold">{comment.author || '익명'}</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {comment.likes_or_score}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {comment.replies}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    };

    return (
      <GlassCard className="relative overflow-hidden" hover={false}>
        {/* 백그라운드 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent pointer-events-none" />
        <div className="relative flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400">
                {title}
              </span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">플랫폼별 성과 및 댓글 분석 요약</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoPreview(v => !v)}
              aria-pressed={autoPreview}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border shadow-sm
                ${autoPreview
                  ? 'bg-gradient-to-r from-brand-secondary-500/20 to-brand-primary-500/20 text-gray-800 dark:text-white border-brand-secondary-400/40 dark:border-white/20 ring-1 ring-brand-secondary-300/50 dark:ring-white/10'
                  : 'bg-gradient-to-r from-brand-secondary-50 to-brand-primary-100 text-gray-800 border-brand-secondary-300 dark:from-brand-secondary-900/20 dark:to-brand-primary-900/20 dark:text-gray-100 dark:border-white/15'}`}
            >
              자동재생 {autoPreview ? 'ON' : 'OFF'}
            </button>
            <div className="text-sm text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-800/40 border border-gray-200/60 dark:border-white/10 px-3 py-1.5 rounded-lg font-semibold backdrop-blur-sm">
              {new Date(uploadDate).toLocaleDateString('ko-KR')}
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6"> 
          <div className="text-center flex flex-col gap-4 p-4 rounded-xl bg-white/60 dark:bg-gray-900/20 border border-gray-200/60 dark:border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-secondary-500/20 to-brand-secondary-600/30 flex items-center justify-center backdrop-blur-sm border border-brand-secondary-300/30 dark:border-brand-secondary-700/30">
                <img src={YouTubeIcon} alt="YouTube" className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-secondary-600 to-brand-secondary-700 dark:from-brand-secondary-400 dark:to-brand-secondary-300">
                  YouTube
                </span>
              </h4>
            </div>
            {youtube ? (() => {
      const [ref, inView] = useInView();
              return (
                <>
                  <div ref={ref} className="aspect-video bg-white/50 dark:bg-gray-800/30 rounded-lg overflow-hidden border border-gray-200/60 dark:border-white/10">
                    {inView && autoPreview ? (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${youtube.video_id}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&modestbranding=1&loop=1&playlist=${youtube.video_id}`}
                        title={youtube.title}
                        loading="lazy"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <img src={youtube.thumbnail} alt={youtube.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <TopCommentList commentData={comments.youtube} platformColor="border-brand-secondary-500" />
                </>
              );
            })() : <p className="text-gray-500">데이터 없음</p>}
          </div>

          <div className="flex flex-col justify-center px-6 py-4 rounded-xl bg-white/60 dark:bg-gray-900/20 border border-gray-200/60 dark:border-white/10 backdrop-blur-lg">
            <h4 className="text-xl font-bold text-center mb-4">
              <span className="text-gray-800 dark:text-gray-200">
                세부 지표 비교
              </span>
            </h4>
            <div className="space-y-1">
              <ComparisonRow metricName="조회수" youtubeValue={youtube?.views} redditValue="정보 없음" />
              <ComparisonRow metricName="좋아요" youtubeValue={youtube?.likes} redditValue={reddit?.upvotes} />
              <ComparisonRow metricName="댓글 수" youtubeValue={youtube?.comments} redditValue={reddit?.comments} />
              <ComparisonRow metricName="참여점수" youtubeValue={youtube?.engagementScore} redditValue={reddit?.engagementScore} tooltipText="(좋아요*0.5 + 댓글*0.8) / 조회수" />
            </div>
            <h4 className="text-xl font-bold text-center mt-6 mb-4">
              <span className="text-gray-800 dark:text-gray-200">
                분위기 요약
              </span>
            </h4>
            <div className="space-y-4 text-sm">
              {comments.youtube && <div className='flex items-start gap-3'><img src={YouTubeIcon} className='w-5 h-5 mt-0.5'/> <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{comments.youtube.atmosphere}</p></div>}
              {comments.reddit && <div className='flex items-start gap-3'><img src={RedditIcon} className='w-5 h-5 mt-0.5'/> <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{comments.reddit.atmosphere}</p></div>}
            </div>
          </div>

          <div className="text-center flex flex-col gap-4 p-4 rounded-xl bg-white/60 dark:bg-gray-900/20 border border-gray-200/60 dark:border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary-500/20 to-brand-primary-600/30 flex items-center justify-center backdrop-blur-sm border border-brand-primary-300/30 dark:border-brand-primary-700/30">
                <img src={RedditIcon} alt="Reddit" className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 dark:from-brand-primary-400 dark:to-brand-primary-300">
                  Reddit
                </span>
              </h4>
            </div>
            {reddit ? (
              <>
                <div className="aspect-video bg-white/50 dark:bg-gray-800/30 rounded-lg overflow-hidden border border-gray-200/60 dark:border-white/10">
                  {reddit.rd_video_url ? (
                    autoPreview ? (
                      <video className="w-full h-full object-cover" src={reddit.rd_video_url} autoPlay loop muted playsInline />
                    ) : (
                      <video className="w-full h-full object-cover" src={reddit.rd_video_url} muted playsInline preload="metadata" />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary-100/50 to-brand-primary-200/30 dark:from-brand-primary-900/30 dark:to-brand-primary-800/20">
                      <MessageSquare className="w-12 h-12 mx-auto text-brand-primary-500/70 dark:text-brand-primary-400/80" />
                    </div>
                  )}
                </div>
                <TopCommentList commentData={comments.reddit} platformColor="border-brand-primary-500" />
              </>
            ) : <p className="text-gray-500">데이터 없음</p>}
          </div>
        </div>
      </GlassCard>
    );
  };

  const VideoPlayerModal = ({ isOpen, onClose, video }) => {
    if (!isOpen) return null;
    const isYoutube = video.url.includes('youtube.com/embed');

    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl w-[90vw] bg-white/90 dark:bg-gray-900/90 border-brand-secondary-200/50 dark:border-brand-secondary-700/50 backdrop-blur-lg rounded-2xl shadow-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{video.title}</h3>
            <button onClick={onClose} className="rounded-full p-1.5 bg-brand-secondary-100/50 dark:bg-brand-secondary-800/30 text-brand-secondary-700 dark:text-brand-secondary-300 hover:bg-brand-secondary-200/60 dark:hover:bg-brand-secondary-700/40 hover:text-brand-secondary-800 dark:hover:text-brand-secondary-200 transition-all"><XIcon className="h-5 w-5" /></button>
          </div>
          <div className="aspect-video w-full">
            {isYoutube ? (
              <iframe src={video.url} title={video.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="w-full h-full rounded-lg"></iframe>
            ) : (
              <video controls autoPlay src={video.url} className="w-full h-full rounded-lg"><p>브라우저가 비디오 태그를 지원하지 않습니다.</p></video>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-8">
      <CrossPlatformSearchCard onSelectContent={handleSelectContent} allContent={allContent} isLoading={isLoadingList} />
      
      <VideoPlayerModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} video={modalVideo} />

      {isLoadingDetails && (
        <motion.div
          className="flex justify-center items-center p-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader className="w-10 h-10 animate-spin text-brand-secondary-500" />
        </motion.div>
      )}
      {error && (
        <motion.div
          className="p-4 text-center text-red-500 bg-gradient-to-r from-red-50/80 to-red-100/60 dark:from-red-950/30 dark:to-red-900/20 rounded-lg border border-red-200/50 dark:border-red-800/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      )}
      
      {selectedContentDetails && !isLoadingDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <UnifiedComparisonView details={selectedContentDetails} autoPreview={autoPreview} setAutoPreview={setAutoPreview} />
        </motion.div>
      )}
    </div>
  );
};

export default IntegratedAnalyticsView;
