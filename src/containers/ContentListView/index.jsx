import { useState, useEffect } from 'react';
import { ContentListView as ContentListFeature } from '@/features/content-modals/ui/ContentListView';
import { getYouTubeChannelId, getRedditChannelInfo, getYouTubeVideosByChannelId, getRedditChannelPosts } from '@/common/api/api';

const ContentListView = () => {
  const [selected_platform, set_selected_platform] = useState('all');
  const [sort_order, set_sort_order] = useState('latest');
  const [contents, set_contents] = useState([]);
  const [is_loading, set_is_loading] = useState(true);
  const [error, set_error] = useState(null);

  useEffect(() => {
    const fetch_data = async () => {
      set_is_loading(true);
      set_error(null);
      set_contents([]);

      try {
        let allData = [];

        const fetchYoutubeData = async () => {
          const channel_info = await getYouTubeChannelId();
          if (channel_info && channel_info.channelId) {
            const video_data = await getYouTubeVideosByChannelId(channel_info.channelId, { sort_by: sort_order });
            return video_data.videos.map(v => ({ ...v, platform: 'YouTube', uploadDate: v.publishedAt, id: v.videoId, title: v.title, views: v.statistics?.viewCount, likes: v.statistics?.likeCount, comments: v.statistics?.commentCount }));
          }
          return [];
        };

        const fetchRedditData = async () => {
          const channel_info = await getRedditChannelInfo();
          if (channel_info && channel_info.channelTitle) {
            const post_data = await getRedditChannelPosts(channel_info.channelTitle);
            return post_data.posts.map(p => ({ id: p.post_id, title: p.title, thumbnail: p.thumbnail, platform: 'Reddit', uploadDate: p.upload_date, upvotes: p.score, comments: p.comment_count, url: p.url, sub_reddit: p.sub_reddit, rd_video_url: p.rd_video_url }));
          }
          return [];
        };

        if (selected_platform === 'youtube') {
          allData = await fetchYoutubeData();
        } else if (selected_platform === 'reddit') {
          allData = await fetchRedditData();
        } else if (selected_platform === 'all') {
          const [youtubeData, redditData] = await Promise.all([
            fetchYoutubeData(),
            fetchRedditData()
          ]);
          allData = [...youtubeData, ...redditData];
        }

        if (sort_order === 'latest') {
          allData.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        } else if (sort_order === 'oldest') {
          allData.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
        } else if (sort_order === 'likes') {
          allData.sort((a, b) => (b.likes || b.upvotes || 0) - (a.likes || a.upvotes || 0));
        } else if (sort_order === 'comments') {
          allData.sort((a, b) => (b.comments || 0) - (a.comments || 0));
        }

        set_contents(allData);

      } catch (err) {
        set_error(err.message);
      } finally {
        set_is_loading(false);
      }
    };

    fetch_data();
  }, [selected_platform, sort_order]);

  return (
    <ContentListFeature 
      selectedPlatform={selected_platform} 
      setSelectedPlatform={set_selected_platform}
      sortOrder={sort_order} 
      setSortOrder={set_sort_order}
      contents={contents}
      isLoading={is_loading}
      error={error}
    />
  );
};

export default ContentListView;