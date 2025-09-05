import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnalyticsView from '@/containers/AnalyticsView';
import VideoAnalysisModal from '@/common/ui/VideoAnalysisModal';
import { mockContentData } from '@/common/utils/mock-data';

const AnalyticsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  useEffect(() => {
    const videoIdFromUrl = searchParams.get('videoId');
    const platformFromUrl = searchParams.get('platform');
    if (videoIdFromUrl) {
      // const video = mockContentData.find(item => item.id === parseInt(videoIdFromUrl));
      // setSelectedVideoId(videoIdFromUrl);
      // setSelectedVideoTitle(video ? video.title : `Video ${videoIdFromUrl}`);
      setSelectedPlatform(platformFromUrl || 'youtube');
    } else {
      setSelectedVideoId(null);
      setSelectedVideoTitle('');
      setSelectedPlatform(null);
    }
  }, [searchParams]);

  const handleCloseModal = () => {
    setSelectedVideoId(null);
    setSelectedVideoTitle('');
    searchParams.delete('videoId');
    setSearchParams(searchParams);
  };

  const handleOpenAnalysisModal = ({ contentId, title, platform }) => {
    setSelectedVideoId(contentId);
    setSelectedVideoTitle(title);
    setSelectedPlatform(platform);
    searchParams.set('videoId', contentId);
    searchParams.set('title', title);
    searchParams.set('platform', platform);
    setSearchParams(searchParams);
  };

  return (
    <>
      <AnalyticsView onVideoCardClick={handleOpenAnalysisModal} />
      <VideoAnalysisModal
        contentId={selectedVideoId}
        title={selectedVideoTitle}
        platform={selectedPlatform}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default AnalyticsPage;
