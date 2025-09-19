import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/common/ui/tooltip';

function EnhancedPlatformCard({ platform, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="h-full"
    >
      <div
        className={`${platform.bgColor} ${platform.borderColor} border rounded-2xl h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.01] relative`}
      >
        {/* Header Section */}
        <div className="p-4 pb-3">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <img src={platform.icon} alt={platform.name} className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">{platform.name}</h3>
                <p className="text-base text-gray-600 dark:text-gray-400">{platform.description}</p>
              </div>
            </div>

            {(platform.totalVideos !== undefined || platform.totalPosts !== undefined) && (
              <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  {platform.totalVideos !== undefined ? platform.totalVideos : platform.totalPosts}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {platform.totalVideos !== undefined ? '총 동영상' : '총 게시글'}
                </div>
              </div>
            )}
          </div>

          {/* Metrics Section */}
          <div className="space-y-4 mb-6">
            {platform?.metrics
              ? Object.entries(platform.metrics).map(([key, metric], i) => {
                  const MetricIcon = metric?.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/30 dark:bg-white/10 flex items-center justify-center">
                        {MetricIcon && <MetricIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {metric?.label ?? '라벨 없음'}
                        </div>
                        <div className="text-xl font-semibold text-gray-800 dark:text-white">
                          {metric?.value ?? '데이터 없음'}
                        </div>
                      </div>
                    </div>
                  );
                })
              : (
                <p className="text-sm text-gray-500 dark:text-gray-400">지표 데이터 없음</p>
              )}
          </div>

          {/* Growth Indicator */}
          {platform?.growth && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <TooltipProvider delayDuration={1000}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-green-600 dark:text-green-400 font-medium text-sm cursor-help">
                        {platform.growth.value ?? '데이터 없음'}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="p-2 bg-white/80 backdrop-blur-sm rounded-md shadow-lg border border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
                      {platform.name === 'YouTube' ? (
                        <p className="text-xs text-gray-800 leading-tight text-center dark:text-gray-200">
                          참여율 = (좋아요 <span className="text-red-600 dark:text-red-400">×0.5</span> + 댓글{' '}
                          <span className="text-green-600 dark:text-green-400">×0.8</span>) ÷ 조회수
                        </p>
                      ) : (
                        <p className="text-xs text-gray-800 leading-tight text-center dark:text-gray-200">
                          평균 참여 = (업보트 + 댓글) ÷{' '}
                          <span className="text-orange-600 dark:text-orange-400">총 포스트 수</span>
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {platform.growth.period ?? '-'}
              </span>
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div className="px-4 pb-4 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">최근 7일 트랜드</h4>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: platform.chartMetrics?.primary?.color }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {platform.chartMetrics?.primary?.label ?? '지표 없음'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: platform.chartMetrics?.secondary?.color }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {platform.chartMetrics?.secondary?.label ?? '지표 없음'}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart Container */}
            <div className="h-32 w-full bg-white/20 dark:bg-white/5 rounded-xl border border-white/30 dark:border-white/20 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={platform.chartData || []}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                    minTickGap={0}
                    tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.7 }}
                  />
                  <YAxis hide />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '11px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={platform.chartMetrics?.primary?.key}
                    stroke={platform.chartMetrics?.primary?.color}
                    strokeWidth={2}
                    dot={{ fill: platform.chartMetrics?.primary?.color, strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 4, fill: platform.chartMetrics?.primary?.color }}
                  />
                  <Line
                    type="monotone"
                    dataKey={platform.chartMetrics?.secondary?.key}
                    stroke={platform.chartMetrics?.secondary?.color}
                    strokeWidth={2}
                    dot={{ fill: platform.chartMetrics?.secondary?.color, strokeWidth: 2, r: 3 }}
                    strokeDasharray="6 3"
                    activeDot={{ r: 4, fill: platform.chartMetrics?.secondary?.color }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export { EnhancedPlatformCard };
