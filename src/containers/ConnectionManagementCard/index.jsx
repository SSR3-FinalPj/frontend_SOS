
import { motion } from 'framer-motion';
import { Link, Unlink } from 'lucide-react';
import GlassCard from '@/common/ui/glass-card';
import ConnectYouTubeButton from '@/common/ui/ConnectYouTubeButton';
import ConnectRedditButton from '@/common/ui/ConnectRedditButton';
import { usePlatformStore } from '@/domain/platform/logic/store';
import { useYouTubeStore } from '@/domain/youtube/logic/store';
import { useRedditStore } from '@/domain/reddit/logic/store';
import { useYouTubeChannelInfo } from '@/domain/youtube/logic/use-youtube-channel-info';
import { useRedditChannelInfo } from '@/domain/reddit/logic/use-reddit-channel-info';

function ConnectionManagementCard({ platformData }) {
  const { platforms, setPlatformStatus } = usePlatformStore();
  const { channelId: youtubeChannelId, channelTitle: youtubeChannelTitle } = useYouTubeStore();
  const { channelId: redditChannelId, channelTitle: redditChannelTitle } = useRedditStore();

  useYouTubeChannelInfo(); // Fetches channel info if Google is connected
  useRedditChannelInfo(); // Fetches channel info if Reddit is connected

  const handleStatusChange = (platformName, status) => {
    setPlatformStatus(platformName.toLowerCase(), status);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <Link className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-white">연동 관리</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">연동된 플랫폼</p>
        </div>

        <div className="space-y-4 mb-6">
          {platformData.map((platform, index) => {
            const Icon = platform.icon;
            const platformNameLower = platform.name.toLowerCase();
            let status;

            if (platformNameLower === 'youtube') {
              status = { connected: platforms.google.connected, channelTitle: youtubeChannelTitle };
            } else if (platformNameLower === 'reddit') {
              status = { connected: platforms.reddit.connected, channelTitle: redditChannelTitle };
            } else {
              status = platforms[platformNameLower];
            }

            const renderConnectButton = () => {
              switch (platform.name) {
                case 'YouTube':
                  return <ConnectYouTubeButton onDone={(newStatus) => handleStatusChange(platform.name, newStatus)} />;
                case 'Reddit':
                  return <ConnectRedditButton onDone={(newStatus) => handleStatusChange(platform.name, newStatus)} />;
                default:
                  return null;
              }
            };

            return (
              <div key={index} className="flex items-center justify-between p-4 bg-white/10 dark:bg-white/5 rounded-xl border border-white/20 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br  flex items-center justify-center`}>
                    <Icon className="w-8 h-10 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">{platform.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{platform.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {status && status.connected ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {status.channelTitle || '연동됨'}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                        onClick={() => handleStatusChange(platform.name, { connected: false, channelTitle: null })}
                      >
                        <Unlink className="w-4 h-4" />
                      </motion.button>
                    </>
                  ) : (
                    renderConnectButton()
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default ConnectionManagementCard;
