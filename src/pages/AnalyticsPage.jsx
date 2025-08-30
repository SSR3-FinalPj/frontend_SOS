import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DetailedAnalyticsView from '../components/dashboard/detailed_analytics_view.jsx';
import VideoAnalysisModal from '../common/ui/VideoAnalysisModal.jsx';
import { mockContentData } from '../common/utils/mockData.js'; // Assuming mockContentData is still needed for initial lookup

/**
 * Analytics Page 컴포넌트
 * 기존 DetailedAnalyticsView를 독립 페이지로 활용
 */
const AnalyticsPage = () => {
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
    <>
      <DetailedAnalyticsView onVideoCardClick={handleOpenAnalysisModal} />
      <VideoAnalysisModal
        videoId={selectedVideoId}
        title={selectedVideoTitle}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default AnalyticsPage;