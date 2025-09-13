/**
 * IntegratedAnalyticsView 컴포넌트
 * 통합 분석 뷰 - 플랫폼 간 성과 비교 분석
 */

import React, { useState, useEffect, useCallback } from 'react';
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
        ? ((details.reddit.upvote * 0.5) + (details.reddit.comment_count * 0.8)) / details.reddit.score
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

  const openVideoModal = (url, title) => {
    setModalVideo({ url, title });
    setIsVideoModalOpen(true);
  };

  // --- Sub-components --- 

  const CrossPlatformSearchCard = ({ onSelectContent, allContent, isLoading }) => {
    const [query, setQuery] = React.useState('');
    const [filteredResults, setFilteredResults] = React.useState([]);

    React.useEffect(() => {
      if (query.length < 1) {
        setFilteredResults([]);
        return;
      }
      if (allContent && allContent.length > 0) {
        const results = allContent.filter(content => content.title.toLowerCase().includes(query.toLowerCase()));
        setFilteredResults(results);
      }
    }, [query, allContent]);

    const handleSelectItem = (content) => {
      onSelectContent(content);
      setQuery('');
      setFilteredResults([]);
    };

    const handleClearSearch = () => setQuery('');

    return (
      <GlassCard>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="비교할 콘텐츠 제목을 검색해보세요..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-brand-secondary-500 focus:ring-2 focus:ring-brand-secondary-500/50 rounded-xl transition-all duration-300"
            disabled={isLoading}
          />
          {query && <button onClick={handleClearSearch} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">×</button>}
        </div>
        {isLoading && <div className="p-4 text-center text-gray-500 dark:text-gray-400"><Loader className="w-6 h-6 mx-auto animate-spin" /></div>}
        {query.length > 0 && !isLoading && (
          <div className="mt-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-lg max-h-80 overflow-y-auto">
            {filteredResults.length > 0 ? (
              filteredResults.map((content) => (
                <button key={content.resultId} onClick={() => handleSelectItem(content)} className="w-full p-4 text-left hover:bg-brand-secondary-50/50 dark:hover:bg-brand-secondary-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><h5 className="font-semibold text-lg text-gray-800 dark:text-white">{content.title}</h5>{content.youtube && <img src={YouTubeIcon} alt="YouTube" className="w-5 h-5" />}{content.reddit && <img src={RedditIcon} alt="Reddit" className="w-5 h-5" />}</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">업로드: {new Date(content.uploadedAt).toLocaleDateString('ko-KR')}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400"><Search className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-sm">검색 결과가 없습니다</p></div>
            )}
          </div>
        )}
      </GlassCard>
    );
  };

  const UnifiedComparisonView = ({ details }) => {
    const { title, uploadDate, youtube, reddit, comments } = details;

    const ComparisonRow = ({ metricName, youtubeValue, redditValue, tooltipText }) => {
      const formatValue = (value) => {
        if (typeof value !== 'number') return value;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
        if (value < 1 && value > 0) return value.toFixed(3);
        return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
      };

      const metricContent = (
        <div className="flex items-center justify-center gap-1.5">
            <span className="text-lg font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary-500 to-brand-primary-500 dark:from-brand-secondary-400 dark:to-brand-primary-400">{metricName}</span>
            {tooltipText && <Info className="w-4 h-4 text-gray-400" />}
        </div>
      );

      return (
        <div className="grid grid-cols-3 items-center py-3.5 border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0">
          <span className="text-xl text-gray-700 dark:text-gray-300 text-right font-medium">{formatValue(youtubeValue)}</span>
          {tooltipText ? (
            <TooltipProvider><Tooltip><TooltipTrigger asChild>{metricContent}</TooltipTrigger><TooltipContent><p>{tooltipText}</p></TooltipContent></Tooltip></TooltipProvider>
          ) : metricContent}
          <span className="text-xl text-gray-700 dark:text-gray-300 text-left font-medium">{redditValue}</span>
        </div>
      );
    };

    const TopCommentList = ({ commentData, platformColor }) => {
      if (!commentData?.['top comments']?.length) return <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-4">주요 댓글이 없습니다.</p>;
      return (
        <div className="space-y-3 mt-4">
          {commentData['top comments'].map(comment => (
            <div key={comment.rank} className={`p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg text-left border-l-4 ${platformColor}`}>
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
      <GlassCard>
        <div className="relative flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1 bg-clip-text text-transparent bg-gradient-to-r from-brand-secondary-600 to-brand-primary-500">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">플랫폼별 성과 및 댓글 분석 요약</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg font-semibold">
            {new Date(uploadDate).toLocaleDateString('ko-KR')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> 
          <div className="text-center flex flex-col gap-4 p-4 rounded-xl bg-gradient-to-b from-brand-secondary-50/30 to-transparent dark:from-brand-secondary-950/10">
            <div className="flex items-center justify-center gap-2"><img src={YouTubeIcon} alt="YouTube" className="w-7 h-7" /><h4 className="font-bold text-xl text-gray-800 dark:text-white">YouTube</h4></div>
            {youtube ? (
              <>
                <div className="aspect-video bg-black rounded-lg overflow-hidden cursor-pointer group relative" onClick={() => openVideoModal(`https://www.youtube.com/embed/${youtube.video_id}`, youtube.title)}>
                  <img src={youtube.thumbnail} alt={youtube.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"><Play className="w-12 h-12 text-white/80" /></div>
                </div>
                <TopCommentList commentData={comments.youtube} platformColor="border-brand-secondary-500" />
              </>
            ) : <p className="text-gray-500">데이터 없음</p>}
          </div>

          <div className="flex flex-col justify-center px-6 py-4 rounded-xl bg-white/50 dark:bg-black/20 border-x-2 border-gray-200/50 dark:border-gray-700/50">
            <h4 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">세부 지표 비교</h4>
            <div className="space-y-1">
              <ComparisonRow metricName="조회수" youtubeValue={youtube?.views} redditValue="정보 없음" />
              <ComparisonRow metricName="좋아요" youtubeValue={youtube?.likes} redditValue={reddit?.upvotes} />
              <ComparisonRow metricName="댓글 수" youtubeValue={youtube?.comments} redditValue={reddit?.comments} />
              <ComparisonRow metricName="참여점수" youtubeValue={youtube?.engagementScore} redditValue={reddit?.engagementScore} tooltipText="(좋아요*0.5 + 댓글*0.8) / 조회수" />
            </div>
            <h4 className="text-xl font-bold text-center text-gray-800 dark:text-white mt-6 mb-4">분위기 요약</h4>
            <div className="space-y-4 text-sm">
              {comments.youtube && <div className='flex items-start gap-3'><img src={YouTubeIcon} className='w-5 h-5 mt-0.5'/> <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{comments.youtube.atmosphere}</p></div>}
              {comments.reddit && <div className='flex items-start gap-3'><img src={RedditIcon} className='w-5 h-5 mt-0.5'/> <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{comments.reddit.atmosphere}</p></div>}
            </div>
          </div>

          <div className="text-center flex flex-col gap-4 p-4 rounded-xl bg-gradient-to-b from-brand-primary-50/30 to-transparent dark:from-brand-primary-950/10">
            <div className="flex items-center justify-center gap-2"><img src={RedditIcon} alt="Reddit" className="w-7 h-7" /><h4 className="font-bold text-xl text-gray-800 dark:text-white">Reddit</h4></div>
            {reddit ? (
              <>
                <div className="aspect-video bg-black rounded-lg overflow-hidden cursor-pointer group relative" onClick={() => openVideoModal(reddit.rd_video_url, reddit.title)}>
                  {reddit.rd_video_url ? 
                    <video src={reddit.rd_video_url} className="w-full h-full object-cover" autoPlay loop muted playsInline /> : 
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"><MessageSquare className="w-12 h-12 mx-auto text-brand-primary-500/70" /></div>}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"><Play className="w-12 h-12 text-white/80" /></div>
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
        <DialogContent className="max-w-4xl w-[90vw] bg-white/90 dark:bg-gray-900/90 border-gray-300/50 dark:border-gray-700/50 backdrop-blur-lg rounded-2xl shadow-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{video.title}</h3>
            <button onClick={onClose} className="rounded-full p-1.5 bg-black/10 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-black/20 dark:hover:bg-white/20 hover:text-gray-900 dark:hover:text-white transition-all"><XIcon className="h-5 w-5" /></button>
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

      {isLoadingDetails && <div className="flex justify-center items-center p-10"><Loader className="w-10 h-10 animate-spin text-brand-secondary-500" /></div>}
      {error && <div className="p-4 text-center text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg">{error}</div>}
      
      {selectedContentDetails && !isLoadingDetails && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <UnifiedComparisonView details={selectedContentDetails} />
        </motion.div>
      )}
    </div>
  );
};

export default IntegratedAnalyticsView;
