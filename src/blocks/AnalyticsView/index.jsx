/**
 * AnalyticsView 블록
 * 분석 페이지의 메인 콘텐츠를 담당하는 뷰 블록
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// 기존 DetailedAnalyticsView는 이제 이 컴포넌트 자체입니다.
import VideoAnalysisModal from '../../common/ui/VideoAnalysisModal.jsx';
import { mockContentData } from '../../common/utils/mockData.js';

/**
 * AnalyticsView 컴포넌트
 * 분석 관련 뷰와 모달을 관리하는 블록
 */
const AnalyticsView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');

  useEffect(() => {
    const videoIdFromUrl = searchParams.get('videoId');
    if (videoIdFromUrl) {
      // Find the video title from mock data or fetch if not available
      const video = mockContentData.find(item => item.id === parseInt(videoIdFromUrl));
      setSelectedVideoId(videoIdFromUrl);
      setSelectedVideoTitle(video ? video.title : `Video ${videoIdFromUrl}`);
    } else {
      setSelectedVideoId(null);
      setSelectedVideoTitle('');
    }
  }, [searchParams]);

  const handleCloseModal = () => {
    setSelectedVideoId(null);
    setSelectedVideoTitle('');
    // Remove videoId from URL when modal is closed
    searchParams.delete('videoId');
    setSearchParams(searchParams);
  };

  // Function to open modal from within DetailedAnalyticsView or other components
  const handleOpenAnalysisModal = (id, title) => {
    setSelectedVideoId(id);
    setSelectedVideoTitle(title);
    searchParams.set('videoId', id);
    setSearchParams(searchParams);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        분석 대시보드
      </h1>
      
      {/* 분석 뷰 내용을 여기에 직접 구현하거나, 필요한 경우 다른 컴포넌트 import */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockContentData.map((item) => (
          <div 
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleOpenAnalysisModal(item.id.toString(), item.title)}
          >
            <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">클릭하여 상세 분석 보기</p>
          </div>
        ))}
      </div>

      <VideoAnalysisModal
        videoId={selectedVideoId}
        title={selectedVideoTitle}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AnalyticsView;