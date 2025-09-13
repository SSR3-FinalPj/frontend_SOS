import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { PieChart as PieChartIcon, Loader2 } from 'lucide-react';
import GlassCard from '@/common/ui/glass-card';
import { useAnalyticsStore } from '@/domain/analytics/logic/store';
import { cn } from '@/common/utils/ui-utils';

// 구분하기 쉬운 다양한 색상 시스템 (5개 카테고리용)
const GRADIENT_COLORS = [
  'hsl(217, 91%, 60%)', // 파란색 - 검색
  'hsl(142, 71%, 45%)', // 초록색 - 추천/탐색  
  'hsl(25, 95%, 53%)', // 주황색 - 채널/구독
  'hsl(348, 83%, 47%)', // 빨간색 - 외부
  'hsl(262, 83%, 58%)' // 보라색 - 기타
];

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, data }) => {
  if (active && payload && payload.length && data) {
    // 실제 총합 계산
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : '0.0';
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/30 dark:border-gray-600/30 rounded-2xl p-4 shadow-2xl"
      >
        <p className="font-semibold text-gray-800 dark:text-white mb-2">
          {payload[0].name}
        </p>
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].payload.fill }}
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {payload[0].value.toLocaleString()}회 ({percentage}%)
          </span>
        </div>
      </motion.div>
    );
  }
  return null;
};

// 커스텀 레전드 컴포넌트
const CustomLegend = ({ payload }) => (
  <motion.div 
    className="flex flex-wrap justify-center gap-4 mt-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.8 }}
  >
    {payload.map((entry, index) => (
      <motion.div
        key={entry.value}
        className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.9 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {entry.value}
        </span>
      </motion.div>
    ))}
  </motion.div>
);

// 로딩 스켈레톤 컴포넌트
const LoadingSkeleton = () => (
  <motion.div 
    className="flex flex-col items-center justify-center h-80 sm:h-96"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
    <p className="text-sm text-gray-600 dark:text-gray-300">트래픽 소스 데이터 로딩 중...</p>
  </motion.div>
);

// 데이터 없음 컴포넌트
const NoDataMessage = () => (
  <motion.div 
    className="flex flex-col items-center justify-center h-80 sm:h-96"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <PieChartIcon className="w-12 h-12 text-gray-400 mb-4" />
    <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
      데이터가 없습니다
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
      선택한 기간에 트래픽 소스 데이터가 없습니다
    </p>
  </motion.div>
);

// 에러 메시지 컴포넌트
const ErrorMessage = ({ error }) => (
  <motion.div 
    className="flex flex-col items-center justify-center h-80 sm:h-96"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
      <PieChartIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
    </div>
    <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
      데이터 로딩 실패
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
      {error}
    </p>
  </motion.div>
);

const TrafficSourceChart = () => {
  const { 
    trafficSourceData, 
    isTrafficLoading, 
    trafficError,
    fetchTrafficSourceData 
  } = useAnalyticsStore();

  // 초기 데이터 로딩
  React.useEffect(() => {
    fetchTrafficSourceData();
  }, [fetchTrafficSourceData]);

  const chartData = trafficSourceData && trafficSourceData.length > 0 
    ? trafficSourceData 
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="p-6" hover={false}>
        {/* 헤더 섹션 */}
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-white/40 dark:border-white/20 flex items-center justify-center shadow-lg">
            <PieChartIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              트래픽 소스 분석
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {trafficSourceData && trafficSourceData.length > 0 
                ? '실제 유입 경로별 조회수' 
                : '유입 경로별 사용자 비율'}
            </p>
          </div>
        </motion.div>

        {/* 차트 영역 */}
        <motion.div 
          className={cn(
            "h-80 sm:h-96 w-full",
            "relative"
          )}
          role="img"
          aria-label="웹사이트 트래픽 소스별 비율을 나타내는 파이 차트"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {isTrafficLoading ? (
            <LoadingSkeleton />
          ) : trafficError ? (
            <ErrorMessage error={trafficError} />
          ) : chartData.length === 0 ? (
            <NoDataMessage />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={window.innerWidth < 640 ? 60 : 90}
                  innerRadius={window.innerWidth < 640 ? 25 : 35}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  animationBegin={500}
                  animationDuration={800}
                >
                  {chartData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                
                <Tooltip content={<CustomTooltip data={chartData} />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
};

export default TrafficSourceChart;