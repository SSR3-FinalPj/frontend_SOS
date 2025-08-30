import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnalyticsView from '../blocks/AnalyticsView';
import VideoAnalysisModal from '../common/ui/VideoAnalysisModal';
import { mockContentData } from '../common/utils/mockData.js';

const AnalyticsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');

  useEffect(() => {
    const videoIdFromUrl = searchParams.get('videoId');
    if (videoIdFromUrl) {
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
    searchParams.delete('videoId');
    setSearchParams(searchParams);
  };

  const handleOpenAnalysisModal = (id, title) => {
    setSelectedVideoId(id);
    setSelectedVideoTitle(title);
    searchParams.set('videoId', id);
    setSearchParams(searchParams);
  };

  return (
    <>
      <AnalyticsView onVideoCardClick={handleOpenAnalysisModal} />
      <VideoAnalysisModal
        videoId={selectedVideoId}
        title={selectedVideoTitle}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default AnalyticsPage;
