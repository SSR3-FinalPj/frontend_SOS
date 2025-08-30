import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Eye, Heart, MessageSquare, VideoOff } from 'lucide-react';
import { getYouTubeChannelId, getYouTubeVideosByChannelId } from '../../common/api/api.js';
import GlassCard from '../../common/ui/glass-card.jsx';

const UploadedContentList = ({ startDate, endDate, onVideoCardClick }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndFilterVideos = async () => {
      if (!startDate || !endDate) {
        setVideos([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const channelInfo = await getYouTubeChannelId();
        if (!channelInfo || !channelInfo.channelId) {
          throw new Error('YouTube 채널 ID를 가져올 수 없습니다.');
        }
        
        const videoData = await getYouTubeVideosByChannelId(channelInfo.channelId, { sortBy: 'latest', limit: 100 });
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // API 응답 구조에 맞춰 필터링 로직 수정
        const filteredVideos = videoData.videos.filter(video => {
          const publishedAtDate = new Date(video.publishedAt);
          return publishedAtDate >= start && publishedAtDate <= end;
        });

        // 불필요한 데이터 가공 로직 제거하고 바로 상태 설정
        setVideos(filteredVideos);

      } catch (err) {
        setError(err.message);
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterVideos();
  }, [startDate, endDate]);

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-600 dark:text-gray-400">불러오는 중...</p>;
    }

    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }

    if (videos.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-400 p-8">
          <VideoOff className="w-12 h-12 mb-4 text-gray-400" />
          <h4 className="font-semibold">해당 기간에 업로드된 영상이 없습니다.</h4>
          <p className="text-sm">다른 기간을 선택해주세요.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 overflow-y-auto max-h-80 custom-scrollbar pr-2">
        {videos.map((content, index) => (
          <div 
            key={content.videoId || index} // key를 videoId로 수정
            className="flex items-center gap-4 p-3 bg-white/20 dark:bg-white/5 rounded-xl cursor-pointer hover:bg-white/30 dark:hover:bg-white/10 transition-colors duration-200"
            onClick={() => onVideoCardClick(content.videoId, content.title)}
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                {index + 1}
              </div>
            </div>
            
            <div className="w-24 h-14 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              <img 
                src={content.thumbnail} // thumbnail 직접 사용
                alt={content.title} // title 직접 사용
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                {content.title} {/* title 직접 사용 */}   
              </h4>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{Number(content.statistics.viewCount).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{Number(content.statistics.likeCount).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{Number(content.statistics.commentCount).toLocaleString()}</span>
                </div>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {new Date(content.publishedAt).toLocaleDateString('ko-KR')} {/* publishedAt 직접 사용 */}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <GlassCard className="p-6" hover={true}>
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-green-500/30 backdrop-blur-sm border border-white/40 dark:border-white/20 flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              업로드된 콘텐츠
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              선택한 기간 내 업로드된 영상 목록
            </p>
          </div>
        </motion.div>

        {renderContent()}
      </GlassCard>
    </motion.div>
  );
};

export default UploadedContentList;
